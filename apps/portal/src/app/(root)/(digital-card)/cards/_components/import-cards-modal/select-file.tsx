import { useEffect, useState } from "react";

import Papa from "papaparse";
import { Controller, UseFormReturn } from "react-hook-form";

import { Spinner } from "@ziron/ui/components/spinner";

import { truncate } from "@ziron/utils";
import { ImportCardType } from "@ziron/validators";

import { FileUpload } from "@/components/ui/file-upload";

const MAX_ROWS_LIMIT = 50000;

export function SelectFile({
	form,
	file,
	fileColumns,
	setFileColumns,
	setFirstRows,
}: {
	form: UseFormReturn<ImportCardType>;
	file: File | null;
	fileColumns: string[] | null;
	setFileColumns: (columns: string[] | null) => void;
	setFirstRows: (rows: Record<string, string>[] | null) => void;
}) {
	const [error, setError] = useState<string | null>(null);
	const [isCountingRows, setIsCountingRows] = useState<boolean>(false);

	useEffect(() => {
		if (!file) {
			setFileColumns(null);
			return;
		}

		setIsCountingRows(true);
		countCsvRows(file)
			.then((rowCount) => {
				if (rowCount > MAX_ROWS_LIMIT) {
					setError(
						`CSV file exceeds the maximum limit of ${MAX_ROWS_LIMIT.toLocaleString()} rows. Please split the file into multiple files and upload them separately.`
					);
					setFileColumns(null);
					setFirstRows(null);
					return;
				}

				return readLines(file, 4).then((lines) => {
					const { data, meta } = Papa.parse(lines, {
						worker: false,
						skipEmptyLines: true,
						header: true,
					});

					if (!data || data.length < 2) {
						setError("CSV file must have at least 2 rows.");
						setFileColumns(null);
						setFirstRows(null);
						return;
					}

					if (!meta || !meta.fields || meta.fields.length <= 1) {
						setError("Failed to retrieve CSV column data.");
						setFileColumns(null);
						setFirstRows(null);
						return;
					}

					setFileColumns(meta.fields);
					setFirstRows(data as Record<string, string>[]);
				});
			})
			.catch(() => {
				setError("Failed to read CSV file.");
				setFileColumns(null);
				setFirstRows(null);
			})
			.finally(() => {
				setIsCountingRows(false);
			});
	}, [file, setFileColumns, setFirstRows]);

	return (
		<div className="flex flex-col gap-3">
			<Controller
				control={form.control}
				name="file"
				render={({ field: { value, onChange } }) => {
					return (
						<FileUpload
							accept="csv"
							className="aspect-auto h-24"
							content={value ? truncate(value.name, 25) : "Click or drag and drop a CSV file."}
							iconClassName="size-6"
							maxFileSizeMB={1}
							onChange={({ file }) => onChange(file)}
						/>
					);
				}}
			/>
			{error ? (
				<p className="text-center text-destructive text-sm">{error}</p>
			) : fileColumns ? (
				<p className="text-muted-foreground text-sm">Columns found: {listColumns(fileColumns)}</p>
			) : file ? (
				<div className="flex items-center justify-center">
					<Spinner />
					{isCountingRows && <p className="ml-2 text-muted-foreground text-sm">Validating file size...</p>}
				</div>
			) : null}
		</div>
	);
}

const maxColumns = 4;

const listColumns = (columns: string[]) => {
	const eachTruncated = columns.map((column) => truncate(column, 16));
	const allTruncated =
		eachTruncated.length <= maxColumns
			? eachTruncated
			: eachTruncated.slice(0, maxColumns).concat(`and ${eachTruncated.length - maxColumns} more`);
	return allTruncated.join(", ");
};

const countCsvRows = async (file: File): Promise<number> => {
	return new Promise((resolve, reject) => {
		let rowCount = 0;

		Papa.parse(file, {
			worker: true,
			skipEmptyLines: true,
			step: () => {
				rowCount++;
			},
			complete: () => {
				resolve(rowCount);
			},
			error: (error) => {
				reject(error);
			},
		});
	});
};

const readLines = async (file: File, count = 4): Promise<string> => {
	const reader = file.stream().getReader();
	const decoder = new TextDecoder("utf-8");
	let { value: chunk, done: readerDone } = await reader.read();
	let content = "";
	while (!readerDone) {
		content += decoder.decode(chunk, { stream: true });
		const lines = content.split("\n");
		if (lines.length >= count) {
			reader.cancel();
			return lines.slice(0, count).join("\n");
		}
		({ value: chunk, done: readerDone } = await reader.read());
	}
	const lines = content.split("\n");
	return lines.slice(0, count).join("\n");
};
