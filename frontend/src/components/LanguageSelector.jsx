function LanguageSelector({ language, setLanguage }) {
    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
        >
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="csharp">C#</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
        </select>
    );
}

export default LanguageSelector;