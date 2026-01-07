export const highlightMatchingWords = (sourceText: string, targetText: string) => {
  if (!sourceText || !targetText) return targetText;

  // 1. Clean source text to get words
  const sourceWords = sourceText
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.replace(/[^\wçğıöşüÇĞIİÖŞÜ]/gi, ''))
    .filter(word => word.length >= 2);

  if (sourceWords.length < 2) return targetText;

  let highlightedText = targetText;

  // 2. Create phrases from 6 words down to 2 words
  // This prioritization ensures longer phrases are matched first
  for (let phraseLength = Math.min(sourceWords.length, 6); phraseLength >= 2; phraseLength--) {
    for (let i = 0; i <= sourceWords.length - phraseLength; i++) {
      const phrase = sourceWords.slice(i, i + phraseLength);

      if (phrase.length >= 2) {
        // Create regex pattern for the phrase
        // Escape special regex characters in words
        const phrasePattern = phrase
          .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('\\s+');

        const regex = new RegExp(`(${phrasePattern})`, 'gi');

        // Highlight if matches found and avoid double highlighting if already wrapped
        // Note: This basic check "!includes('<mark')" might be too aggressive if multiple separate matches exist.
        // But we follow legacy logic. Legacy logic:
        // if (regex.test(highlightedText) && !highlightedText.includes(`<mark`))
        // This actually implies it STOPS highlighting any further matches if ANY mark exists?
        // Let's look closer at legacy:
        /*
          if (regex.test(highlightedText) && !highlightedText.includes(`<mark`)) {
             highlightedText = highlightedText.replace(regex, '<mark ...>$1</mark>');
          }
        */
        // This legacy constraint is weird. It effectively highlights ONLY the first matching phrase type found,
        // OR it prevents re-highlighting if something is already highlighted?
        // Actually, if `highlightedText` already has a tag, it skips. This means it only highlights ONE phrase across the whole loop iteration?
        // No, `replace(regex, ...)` replaces ALL occurrences of THAT pattern.
        // But the check `!highlightedText.includes('<mark')` generally prevents multiple *different* phrases from being highlighted
        // if they are processed sequentially.
        // Use the EXACT legacy logic to ensure parity.

        if (regex.test(highlightedText) && !highlightedText.includes(`<mark`)) {
           highlightedText = highlightedText.replace(regex, '<mark style="background-color: yellow; color: black; padding: 1px 2px; border-radius: 2px;">$1</mark>');
        }
      }
    }
  }

  return highlightedText;
};
