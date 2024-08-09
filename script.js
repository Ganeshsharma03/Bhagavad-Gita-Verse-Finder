document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('search-form');
  const chapterSelect = document.getElementById('chapter-select');
  const verseSelect = document.getElementById('verse-select');
  const resultContainer = document.getElementById('result-container');

  let data = null;

  // Load JSON data
  fetch('bhagavad-gita.json')
      .then(response => response.json())
      .then(jsonData => {
          data = jsonData;
          populateChapters();
      })
      .catch(error => console.error('Error loading JSON:', error));

  // Populate chapters dropdown
  function populateChapters() {
      if (!data) return;

      data.chapters.forEach(chapter => {
          const option = document.createElement('option');
          option.value = chapter.chapter_number;
          option.textContent = `Chapter ${chapter.chapter_number} - ${chapter.chapter_name}`;
          chapterSelect.appendChild(option);
      });

      chapterSelect.addEventListener('change', function () {
          populateVerses(this.value);
      });
  }

  // Populate verses dropdown based on selected chapter
  function populateVerses(chapterNumber) {
      verseSelect.innerHTML = '<option value="">--Select Verse--</option>'; // Clear previous options

      if (!data) return;

      const chapter = data.chapters.find(chap => chap.chapter_number == chapterNumber);
      if (chapter) {
          chapter.verses.forEach(verse => {
              const option = document.createElement('option');
              option.value = verse.verse_number;
              option.textContent = `Verse ${verse.verse_number}`;
              verseSelect.appendChild(option);
          });
      }
  }

  // Handle form submission
  searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const chapterNumber = chapterSelect.value;
      const verseNumber = verseSelect.value;
      const result = searchVerses(chapterNumber, verseNumber);
      displayResult(result);
  });

  // Search for the selected verse
  function searchVerses(chapterNumber, verseNumber) {
      if (!data) return [];

      let results = [];
      const chapter = data.chapters.find(chap => chap.chapter_number == chapterNumber);
      if (chapter) {
          const verse = chapter.verses.find(verse => verse.verse_number == verseNumber);
          if (verse) {
              results.push({
                  chapter: chapter.chapter_name,
                  verse_number: verse.verse_number,
                  ...verse
              });
          }
      }
      return results;
  }

  // Display the result
  function displayResult(verses) {
      resultContainer.innerHTML = '';
      if (verses.length === 0) {
          resultContainer.innerHTML = '<p>No verses found.</p>';
          return;
      }

      verses.forEach(verse => {
          const verseDiv = document.createElement('div');
          verseDiv.classList.add('verse');
          verseDiv.innerHTML = `
              <h2>Chapter ${verse.chapter}</h2>
              <p><strong>Verse ${verse.verse_number}:</strong> ${verse.sanskrit}</p>
              <p><strong>Translation:</strong> ${verse.translation}</p>
              <p><strong>Transliteration:</strong> ${verse.transliteration}</p>
              <p><strong>Meaning:</strong> ${verse.meaning}</p>
          `;
          resultContainer.appendChild(verseDiv);
      });
  }
});
