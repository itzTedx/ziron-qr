import { useMemo } from "react";

import { getQRData, QRCodeSVG } from "@/lib/qr";
import { DEFAULT_MARGIN } from "@/lib/qr/constants";
import { ImageSettings } from "@/lib/qr/types";

export function QRCode({
	url,
	fgColor,
	hideLogo,
	logo,
	scale = 1,
	margin = DEFAULT_MARGIN,
	className,
}: {
	url: string;
	fgColor?: string;
	hideLogo?: boolean;
	logo?: string;
	scale?: number;
	margin?: number;
	className?: string;
}) {
	const qrData = useMemo(
		() => getQRData({ url, fgColor, hideLogo, logo, margin }),
		[url, fgColor, hideLogo, logo, margin]
	);

	return (
		<QRCodeSVG
			bgColor={qrData.bgColor}
			className={className}
			fgColor={qrData.fgColor}
			level={qrData.level}
			margin={qrData.margin}
			size={(qrData.size / 8) * scale}
			value={qrData.value}
			{...(qrData.imageSettings?.src && {
				imageSettings: {
					...qrData.imageSettings,
					src: qrData.imageSettings.src,
					height: (qrData.imageSettings.height / 8) * scale,
					width: (qrData.imageSettings.width / 8) * scale,
				} as ImageSettings,
			})}
		/>
	);
}
