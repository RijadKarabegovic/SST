import React, { useState } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import styles from "../../style";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
  const [temp, setTemp] = useState([]);

  // Functionality for adding new synonyms
  const addWord = async () => {
    //Checking if there is already created document for this new word
    const docRef = doc(db, "words", word);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setError("This word already exists!");
    } else {
      // Start of logic for saving the new word

      let synonymsOfNewWord = [];
      try {
        // Checking if these new synonyms are already stored and existing in db
        const transformToArray = synonyms.split(", ");

        if (transformToArray.length > 1) {
          transformToArray.map(async (syn) => {
            const docRef = doc(db, "words", syn);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              // If synonym exists, then we update its synonyms with new word
              const oldSynonyms = docSnap.data().synonyms;
              const newSynonyms = [word, ...docSnap.data().synonyms];
              const currentDocRef = doc(db, "words", syn);

              setTemp([...docSnap.data().synonyms]);
              await updateDoc(currentDocRef, {
                synonyms: newSynonyms,
              });
              oldSynonyms.map(async (oldSyn) => {
                const docRef = doc(db, "words", oldSyn);
                const newDocSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                  const newOldSynonyms = [word, ...newDocSnap.data().synonyms];

                  await updateDoc(currentDocRef, {
                    synonyms: newOldSynonyms,
                  });
                }
              });
            } else {
              // If we add synonym that is not previously stored, this will create new doc in db for that specific synonym
              transformToArray.map(async (synonym) => {
                const newSynonyms = transformToArray.filter(
                  (x) => x !== synonym
                );
                newSynonyms.push(word);

                await setDoc(doc(db, "words", synonym), {
                  word: synonym,
                  synonyms: newSynonyms,
                });
              });
            }
          });
          // Functionality that will merge old and new synonyms
          synonymsOfNewWord = temp.concat(transformToArray);

          // Case when there is only one synonym added to word
        } else {
          const docRef = doc(db, "words", synonyms);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const synonymsUpdate = docSnap.data().synonyms;

            await updateDoc(docRef, {
              synonyms: [...synonymsUpdate, word],
            });
            synonymsUpdate.forEach(async (sin) => {
              const docRef = doc(db, "words", sin);
              const docSnap = await getDoc(docRef);
              await updateDoc(docRef, {
                synonyms: [...docSnap.data().synonyms, word],
              });
            });
            const newArray = [];
            newArray.push(synonyms);
            synonymsOfNewWord = newArray.concat(synonymsUpdate);
          }
        }
        // Final setting of full synonym list
        await setDoc(doc(db, "words", word), {
          word,
          synonyms: synonymsOfNewWord,
        });
        // Push notification when user successfully add a new word
        toast.success("Success added new word with synonyms!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (e) {
        toast.error("Error!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }

    setSynonyms([]);
    setWord("");
  };
  // Functionality for displaying synonyms
  const getSynonyms = async () => {
    const docRef = doc(db, "words", word);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSynonyms(docSnap.data().synonyms);
    } else {
      toast.error("Success Notification !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const [mode, setMode] = useState("search");
  const [word, setWord] = useState("");
  const [synonyms, setSynonyms] = useState([]);
  const [error, setError] = useState("");

  // Array created in order to prevent any error with duplicates
  const uniqueArray = [...new Set(synonyms)];

  return (
    <>
      <ToastContainer />
      <div
        className={`${styles.flexCenterClass} ${styles.marginYClass} ${styles.paddingClass} sm:flex-col flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}
      >
        <h1 className="font-poppins font-semibold ss:text-[48px] text-[52px] ss:leading-[100.8px] leading-[75px] w-full text-White">
          Synonyms Search Tool
        </h1>

        {mode === "search" ? (
          <>
            <div>
              <label className={`${styles.paragraphClass} max-w-[470px] mt-5 `}>
                Word:
                <div className={`break-normal`}></div>
                <input
                  className={`bg-dimBlack w-full`}
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value.toLowerCase())}
                />
              </label>
              <div className={`break-normal sm:px-6 px-6 sm:py-4 py-4`}></div>

              <button
                className={`${styles.buttonClass} ${styles}`}
                onClick={getSynonyms}
              >
                Get Synonyms
              </button>
            </div>
            <br />
            {uniqueArray && uniqueArray.length > 1 && (
              <div className={`${styles.paragraphClass}`}>
                Synonyms:
                <ul>
                  {uniqueArray?.map((synonym) => (
                    <li key={synonym}>{synonym}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className={`sm:flex-col flex-col`}>
            <div className={`break-normal`}>
              <label className={`${styles.paragraphClass}`}>
                Word:
                <div className={`${styles.breakClass}`}>
                  <input
                    className={`bg-dimBlack`}
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value.toLowerCase())}
                  />
                </div>
              </label>
            </div>
            <div className={`break-normal sm:px-6 px-6 sm:py-8 py-4`}>
              <label className={`${styles.paragraphClass}`}>
                Synonym(s):
                <div className={`${styles.breakClass}`}>
                  <input
                    className={`bg-dimBlack`}
                    type="text"
                    value={synonyms}
                    onChange={(e) => setSynonyms(e.target.value.toLowerCase())}
                  />
                </div>
              </label>
            </div>
            <button
              className={`${styles.buttonClass} ${styles}`}
              onClick={addWord}
            >
              Add{" "}
              {true ? (
                <p>Add</p>
              ) : (
                <svg
                  class="animate-spin h-5 w-5 mr-3 ..."
                  viewBox="0 0 24 24"
                ></svg>
              )}
            </button>
            <h1>{error}</h1>
            <h2 className="font-poppins font-semibold ss:text-[12px] text-[12px] ss:leading-[100.8px] leading-[75px] w-full text-White">
              If you are adding multiple synonyms simultaneously, it is
              important to separate them using a comma followed by a space. Ex.
              "large, huge"
            </h2>
          </div>
        )}
      </div>
      <div
        className={`${styles.flexCenterClass} ${styles.marginYClass} ${styles.paddingClass} ${styles.paddingXClass} sm:flex-row flex-col  rounded-[20px] box-shadow`}
      >
        <h2 className={styles.heading2Class}>Change mode to</h2>
        <button
          className={`${styles.buttonClass} ${styles}`}
          onClick={() => {
            if (mode === "search") {
              setMode("add");
              setSynonyms([]);
              setWord("");
            } else {
              setMode("search");
              setSynonyms([]);
              setWord("");
            }
          }}
        >
          {mode === "search" ? "Add" : "Search"}
        </button>
      </div>
    </>
  );
};

export default Form;
