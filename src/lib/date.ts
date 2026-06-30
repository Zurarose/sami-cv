const MONTH_ALIASES: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const ISO_DATE_RE = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/;
const LEGACY_MONTH_YEAR_RE =
  /^(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sept?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{2,4})$/i;

function parseLegacyMonthYear(value: string) {
  const match = value.trim().replace(/\s+/g, ' ').match(LEGACY_MONTH_YEAR_RE);
  if (!match) return null;

  const monthIndex = MONTH_ALIASES[match[1].toLowerCase()];
  if (monthIndex === undefined) return null;

  const yearRaw = match[2];
  const year = yearRaw.length === 2 ? 2000 + Number(yearRaw) : Number(yearRaw);

  if (Number.isNaN(year)) return null;

  return { monthIndex, year };
}

function formatMonthYear(year: number, monthIndex: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, monthIndex, 1)));
}

export function toDateInputValue(value?: string | null): string {
  if (!value) return '';

  const trimmed = value.trim();
  const isoMatch = trimmed.match(ISO_DATE_RE);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${year}-${month}-${day ?? '01'}`;
  }

  const legacy = parseLegacyMonthYear(trimmed);
  if (legacy) {
    return `${legacy.year.toString().padStart(4, '0')}-${String(
      legacy.monthIndex + 1
    ).padStart(2, '0')}-01`;
  }

  return '';
}

export function toMonthYearValue(value?: string | null): string {
  if (!value) return '';

  const trimmed = value.trim();
  const isoMatch = trimmed.match(ISO_DATE_RE);
  if (isoMatch) {
    const [, year, month] = isoMatch;
    return formatMonthYear(Number(year), Number(month) - 1);
  }

  const legacy = parseLegacyMonthYear(trimmed);
  if (legacy) {
    return formatMonthYear(legacy.year, legacy.monthIndex);
  }

  return trimmed;
}
