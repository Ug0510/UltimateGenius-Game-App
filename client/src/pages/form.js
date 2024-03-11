import React from 'react';
import styles from './form.module.css'; // Import CSS module for styling

class AnimatedLoginForm extends React.Component {
  render() {
    // Array to hold spans
    const spans = [];
    // Number of spans in the original code
    const numberOfSpans = 200; // Change this number to match the original code

    // Push spans to array
    for (let i = 0; i < numberOfSpans; i++) {
      spans.push(<span key={i}></span>);
    }

    return (
      <div className={styles.container}> {/* Apply container class for styling */}
        <section className={styles.sectionContainer}>
          {spans} {/* Render spans */}
          <div className={styles.signinContainer}> {/* Apply signin class for styling */}
            <div className={styles.signinContent}> {/* Apply content class for styling */}
              <h2>Sign In</h2>
              <div className={styles.form}> {/* Apply form class for styling */}
                <div className={styles.inputBox}> {/* Apply inputBox class for styling */}
                  <input type="text" required /> {/* Use required attribute directly */}
                  <i>Username</i>
                </div>
                <div className={styles.inputBox}> {/* Apply inputBox class for styling */}
                  <input type="password" required /> {/* Use required attribute directly */}
                  <i>Password</i>
                </div>
                <div className={styles.links}> {/* Apply links class for styling */}
                  <a href="#">Forgot Password</a>
                  <a href="#">Signup</a>
                </div>
                <div className={styles.inputBox}> {/* Apply inputBox class for styling */}
                  <input type="submit" value="Login" /> {/* Use input type submit for login button */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default AnimatedLoginForm;
