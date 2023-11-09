import React, { useState, useRef } from 'react';
import './landing.css';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Tesseract, { setLogging } from 'tesseract.js';
import levenshtein from 'fast-levenshtein';

function Landing() {
  const [image, setImage] = useState(null);

  const [dropZoneActive, setDropZoneActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const inputRef = useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDropZoneActive(true);
  };

  const hadleDragLeave = (e) => {
    e.preventDefault();
    setDropZoneActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    console.log(e);

    const url = URL.createObjectURL(e.target.files[0]);

    Tesseract.recognize(url, 'eng', { logger: (m) => console.log(m) }).then(
      ({ data: { text } }) => {
        console.log(text);
      }
    );
  };

  const arr = ['info'];

  const split = text.split(/\n/g).filter((l) => l.trim() !== '');

  text
    .split(/\n/g)
    .filter((l) => l.trim() !== '')
    .forEach((line, i) => {
      const words = line.split(' ');

      for (const word of words) {
        for (const correctWord of arr) {
          if (levenshtein.get(word, correctWord) <= 2) {
            console.log('replace ' + word + ' with ' + correctWord);
          }
        }
      }
    });

  return (
    <>
      <div className='container'>
        <h1 className='heading'>
          {' '}
          <span style={{ color: '#e94f37' }}>OCR</span> is Ready!
        </h1>
        <p className='sub-heading'>Start by uploading your images here</p>

        <div className='drop-area'>
          <div
            onDragOver={handleDragOver}
            onDragLeave={hadleDragLeave}
            onDrop={handleDrop}
            className={'inner-area' + (dropZoneActive ? ' active' : '')}
          >
            <FileUploadOutlinedIcon style={{ width: '50px', height: '50px' }} />
            <h1 style={{ fontWeight: 600, marginBottom: '0px' }}>
              Drag & drop files here
            </h1>
            <p>OR</p>
            <input
              type='file'
              onChange={async (e) => {
                const url = URL.createObjectURL(e.target.files[0]);

                setLoading(true);
                Tesseract.recognize(url, 'eng')
                  .then(({ data: { text } }) => {
                    setText(text);
                  })
                  .finally(() => setLoading(false));
              }}
              hidden={true}
              ref={inputRef}
            />
            <button className='browse' onClick={() => inputRef.current.click()}>
              Browse files
            </button>
            {loading && <p>Loading...</p>}
          </div>
        </div>

        {text && (
          <textarea
            cols='100'
            rows='20'
            value={text}
            className='text_box'
            disabled
          />
        )}

        {image && (
          <div className='preview'>
            <img src={URL.createObjectURL(image)} alt='thumb' />
          </div>
        )}
      </div>
    </>
  );
}

export default Landing;
