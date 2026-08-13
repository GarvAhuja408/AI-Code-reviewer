import Editor from "@monaco-editor/react";

function CodeEditor({ code, setCode, language }) {
    return (
        <Editor
            height="500px"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
                fontSize: 15,
                minimap: { enabled: false },
                automaticLayout: true,
            }}
        />
    );
}

export default CodeEditor;