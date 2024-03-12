import React, { useState } from 'react';
import Parallax from 'parallax-js'; // Import Parallax library
import styles from './FileUploadForm.module.css'; // Import CSS module

function FileUploadForm() {
  // State variables
  const [fileName, setFileName] = useState('');
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [fileInputVisible, setFileInputVisible] = useState(false);
  const [cardState, setCardState] = useState('upload'); // 'upload', 'success', or 'error'

  // Event handlers
  const handleUpload = () => {
    setTimeout(() => {
      setCardState('error');
    }, 500);
  };

  const handleTryAgain = () => {
    setTimeout(() => {
      setCardState('success');
    }, 400);
  };

  const handleUploadAnother = () => {
    setFileInputVisible(true);
    setFileName('');
    setTimeout(() => {
      setCardState('upload');
    }, 800);
  };

  const handleFileChange = (event) => {
    setFileName(event.target.value.replace(/C:\\fakepath\\/i, ''));
    setUploadDisabled(false);
    setFileInputVisible(true);
  };

  // Initialize Parallax effect
  React.useEffect(() => {
    const scene = document.getElementById('scene');
    const scene2 = document.getElementById('scene2');
  
    if (scene) {
      const parallax = new Parallax(scene);
      return () => {
        parallax.destroy();
      };
    }
  
    if (scene2) {
      const parallax2 = new Parallax(scene2);
      return () => {
        parallax2.destroy();
      };
    }
  }, []);

  return (
    <>
      {/* about */}
      <div className={styles.about}>
        <a className={`${styles.bg_links} ${styles.social} ${styles.portfolio}`} href="https://www.rafaelalucas.com/dailyui" target="_blank">
          <span className={styles.icon}></span>
        </a>
        <a className={`${styles.bg_links} ${styles.social} ${styles.dribbble}`} href="https://dribbble.com/rafaelalucas" target="_blank">
          <span className={styles.icon}></span>
        </a>
        <a className={`${styles.bg_links} ${styles.social} ${styles.linkedin}`} href="https://www.linkedin.com/in/rafaelalucas/" target="_blank">
          <span className={styles.icon}></span>
        </a>
        <a className={`${styles.bg_links} ${styles.logo}`}></a>
      </div>
      {/* end about */}

      <div className={styles.wrapper}>
        <div className={styles.content}>
          {cardState === 'upload' && (
            <div className={`${styles.card} ${styles.cardUpload}`}>
              <article>
                <h2 className={styles.titleCard}>choose your file to upload</h2>
                <div className={styles.inputContent}>
                  <input
                    type="file"
                    id="inputFile"
                    className={styles.inputFile}
                    onChange={handleFileChange}
                    style={{ visibility: fileInputVisible ? 'visible' : 'hidden' }}
                  />
                  <label tabIndex="0" htmlFor="inputFile" className={styles.uploadIcon}></label>
                  <label tabIndex="0" htmlFor="inputFile" className={styles.fileReturn}>
                    {fileName}
                  </label>
                </div>
                <button className={`${styles.cta} ${styles.btnUpload}`} disabled={uploadDisabled} onClick={handleUpload}>
                  upload
                </button>
              </article>
            </div>
          )}

          {cardState === 'success' && (
            <div className={`${styles.card} ${styles.cardSuccess}`}>
              <div className="scene" id="scene2" data-hover-only="false">
                <figure data-depth="1">
                  <img src="https://www.rafaelalucas.com/dailyui/11/assets/shape_success.svg" alt="" />
                </figure>
                <figure data-depth="0.6">
                  <img src="https://www.rafaelalucas.com/dailyui/11/assets/icon_success.svg" alt="" />
                </figure>
              </div>
              <article>
                <p className={styles.description}>Your file was uploaded successfully!</p>
                <button className={`${styles.cta} ${styles.btnAnother}`} onClick={handleUploadAnother}>
                  <span>Upload Another</span>
                </button>
              </article>
            </div>
          )}

          {cardState === 'error' && (
            <div className={`${styles.card} ${styles.cardError}`}>
              <div className="scene" id="scene" data-hover-only="false">
                <figure data-depth="1">
                  <img src="https://www.rafaelalucas.com/dailyui/11/assets/shape_error.svg" alt="" />
                </figure>
                <figure data-depth="0.6">
                  <img src="https://www.rafaelalucas.com/dailyui/11/assets/icon_error.svg" alt="" />
                </figure>
              </div>
              <article>
                <p className={styles.description}>We got an error trying to upload your file!</p>
                <button className={`${styles.cta} ${styles.btnTry}`} type='button' onClick={handleTryAgain}>
                  Try again
                </button>
              </article>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FileUploadForm;
