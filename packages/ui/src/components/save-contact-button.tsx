"use client";

import { CardType } from "@ziron/db/schema";
import { cn } from "@ziron/utils";

import { Button } from "./button";

interface SaveContactButtonProps {
  style?: React.CSSProperties;
  data: Partial<CardType>;
  imageBase64?: string;
  className?: string;
}

export default function SaveContactButton({ style, data, imageBase64, className }: SaveContactButtonProps) {
  const generateVCard = () => {
    const lines: string[] = [];

    const name = data.name || "";
    const org = data.organization?.name || "";
    const title = data.designation || "";
    const address = data.address || "";
    const note = data.bio || "";

    const phones = Array.isArray(data.phones) ? data.phones : [];
    const emails = Array.isArray(data.emails) ? data.emails : [];

    // Split name into first/last
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    lines.push("BEGIN:VCARD");
    lines.push("VERSION:4.0");

    // Required name fields
    lines.push(`N:${lastName};${firstName};;;`);
    lines.push(`FN:${name}`);

    if (org) lines.push(`ORG:${org}`);
    if (title) lines.push(`TITLE:${title}`);

    // Phones
    phones.forEach((p) => {
      if (p.phone) {
        lines.push(`TEL;TYPE=work,voice;VALUE=uri:tel:${p.phone.replace(/\s+/g, "")}`);
      }
    });

    // Emails
    emails.forEach((e) => {
      if (e.email) {
        lines.push(`EMAIL;TYPE=work:${e.email}`);
      }
    });

    // Address — vCard 4.0 structured format
    if (address) {
      lines.push(`ADR;TYPE=work:;;${address};;;;`);
    }

    // PHOTO (use data URL if base64 provided)
    if (imageBase64) {
      lines.push(`PHOTO:data:image/jpeg;base64,${imageBase64}`);
    }

    // LOGO
    if (data.organization?.logo) {
      // logo must be a URL or a data URI
      lines.push(`LOGO:${data.organization.logo}`);
    }

    if (note) lines.push(`NOTE:${note}`);

    lines.push("END:VCARD");

    return lines.join("\n");
  };

  const downloadVCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const vCardData = generateVCard();
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${data.name} - ${data.organization?.name}.vcf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button className={cn("w-full", className)} onClick={downloadVCard} style={style}>
      Add Contact
    </Button>
  );
}
