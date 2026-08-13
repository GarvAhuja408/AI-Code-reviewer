import { useState } from "react";
import Navbar from "./components/Navbar";
import CodeEditor from "./components/CodeEditor";
import LanguageSelector from "./components/LanguageSelector";
import ReviewPanel from "./components/ReviewPanel";
import "./App.css";
import axios from "axios";

function App() {
    const [language, setLanguage] = useState("javascript");

    const [code, setCode] = useState(
`function add(a, b) {
    return a + b;
}

console.log(add(10, 20));`
    );

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleReview = async (action) => {
    try {
        setLoading(true);
        setResult(null);

        const response = await axios.post(
            "http://localhost:5000/api/review",
            {
                code,
                language,
                action
            }
        );

        setResult({
        explanation: response.data.result,
        fixedCode: response.data.fixedCode,
        suggestions: response.data.suggestions,
        complexity: response.data.complexity
});

    } catch (error) {
        console.error(error);

        setResult({
            explanation: "Something went wrong while reviewing the code."
        });

    } finally {
        setLoading(false);
    }
};

    return (
        <div className="app">
            <Navbar />

            <main className="container">

                <section className="left-panel">

                    <div className="toolbar">
                        <LanguageSelector
                            language={language}
                            setLanguage={setLanguage}
                        />

                        <div className="buttons">
                            <button
                                onClick={() => handleReview("fix")}
                            >
                                Fix Code
                            </button>

                            <button
                                onClick={() => handleReview("explain")}
                            >
                                Explain Code
                            </button>
                        </div>
                    </div>

                    <div className="editor-container">
                        <CodeEditor
                            code={code}
                            setCode={setCode}
                            language={language}
                        />
                    </div>

                </section>

                <section className="right-panel">
                    <ReviewPanel
                        result={result}
                        loading={loading}
                    />
                </section>

            </main>

            <footer className="footer">
            Made by Garv Ahuja
            </footer>

        </div>
    );
}

export default App;