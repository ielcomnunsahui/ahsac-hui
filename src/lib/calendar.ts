import { format } from "date-fns";

interface CalendarEvent {
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
}

export const generateICSFile = (event: CalendarEvent): string => {
  const formatDateForICS = (date: Date): string => {
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const escapeText = (text: string): string => {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;")
      .replace(/\n/g, "\\n");
  };

  const endDate = event.endDate || new Date(event.startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ASAC SDG Advocacy Club//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${formatDateForICS(event.startDate)}`,
    `DTEND:${formatDateForICS(endDate)}`,
    `SUMMARY:${escapeText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeText(event.description)}` : "",
    event.location ? `LOCATION:${escapeText(event.location)}` : "",
    `UID:${Date.now()}@asac-events`,
    `DTSTAMP:${formatDateForICS(new Date())}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return icsContent;
};

export const downloadICSFile = (event: CalendarEvent): void => {
  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
