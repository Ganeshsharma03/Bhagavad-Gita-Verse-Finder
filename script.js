document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const [searchForm, chapterSelect, verseSelect, resultContainer, keywordInput] = 
        ['search-form', 'chapter-select', 'verse-select', 'result-container', 'keyword-search'].map($);

  let data;

  fetch('bhagavad-gita.json')
      .then(res => res.json())
      .then(json => {
          data = json;
          chapterSelect.innerHTML += data.chapters.map(chap => 
              `<option value="${chap.chapter_number}">Chapter ${chap.chapter_number} - ${chap.chapter_name}</option>`
          ).join('');
      })
      .catch(err => console.error('Error loading JSON:', err));

  chapterSelect.addEventListener('change', () => {
      const chapter = data.chapters.find(chap => chap.chapter_number == chapterSelect.value);
      verseSelect.innerHTML = '<option value="">--Select Verse--</option>' + 
          (chapter ? chapter.verses.map(verse => 
              `<option value="${verse.verse_number}">Verse ${verse.verse_number}</option>`).join('') : '');
      toggleInputs();
  });

  searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const [chapterNum, verseNum, keyword] = [chapterSelect.value, verseSelect.value, keywordInput.value.trim().toLowerCase()];
      if (keyword && !chapterNum && !verseNum) displayResult(searchByKeyword(keyword));
      else if (chapterNum && verseNum && !keyword) displayResult(searchVerses(chapterNum, verseNum));
      else resultContainer.innerHTML = '<p>Please either select a chapter and verse, or enter a keyword. Do not use both.</p>';
  });

  const searchVerses = (chapterNum, verseNum) => {
      const chapter = data.chapters.find(chap => chap.chapter_number == chapterNum);
      const verse = chapter?.verses.find(verse => verse.verse_number == verseNum);
      return verse ? [{ chapter: chapter.chapter_name, ...verse }] : [];
  };

  const searchByKeyword = keyword => 
      data.chapters.flatMap(chap => chap.verses.filter(verse => 
          [verse.translation, verse.transliteration, verse.meaning].some(text => text.toLowerCase().includes(keyword)))
          .map(verse => ({ chapter: chap.chapter_name, ...verse })));

  const displayResult = verses => {
      resultContainer.innerHTML = verses.length ? verses.map(verse => `
          <div class="verse">
              <h2>Chapter ${verse.chapter}</h2>
              <p><strong>Verse ${verse.verse_number}:</strong> ${verse.sanskrit}</p>
              <p><strong>Translation:</strong> ${verse.translation}</p>
              <p><strong>Transliteration:</strong> ${verse.transliteration}</p>
              <p><strong>Meaning:</strong> ${verse.meaning}</p>
          </div>`).join('') : '<p>No verses found.</p>';
  };

  const toggleInputs = () => {
      const [keyword, chapter, verse] = [keywordInput.value.trim(), chapterSelect.value, verseSelect.value];
      chapterSelect.disabled = verseSelect.disabled = !!keyword;
      keywordInput.disabled = !!chapter || !!verse;
  };

  keywordInput.addEventListener('input', toggleInputs);
});
