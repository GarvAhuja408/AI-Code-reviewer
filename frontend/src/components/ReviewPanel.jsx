import { useState } from "react";

function ReviewPanel({ result, loading }) {
    const [copied, setCopied] = useState(false);

    if (loading) {
        return (
            <div className="review-panel">
                <h2>AI Review</h2>
                <div className="loading">
                    AI is reviewing your code...
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="review-panel">
                <h2>AI Review</h2>
                <div className="empty">
                    Click Explain Code or Fix Code to get an AI review.
                </div>
            </div>
        );
    }

    const copyCode = async () => {
        if (!result.fixedCode) return;

        await navigator.clipboard.writeText(result.fixedCode);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="review-panel">
            <h2>AI Review</h2>

            {result.explanation && (
                <div className="result-section">
                    <pre className="ai-result">
                        {result.explanation}
                    </pre>
                </div>
            )}

            {result.fixedCode && (
                <div className="fixed-code-section">
                    <div className="fixed-code-header">
                        <h3>Fixed Code</h3>

                        <button onClick={copyCode}>
                            {copied ? "Copied!" : "Copy Code"}
                        </button>
                    </div>

                    <pre className="fixed-code">
                        {result.fixedCode}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default ReviewPanel;