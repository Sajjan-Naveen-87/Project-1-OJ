import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import AuthProvider, { AuthContext } from '../AuthProvider';
import FuzzyText from "../../FuzzyText/FuzzyText";
import axios from 'axios';
import MarkdownRenderer from "../AiChatbot/MarkdownRenderer";
import { FaRobot } from "react-icons/fa";

const Compiler = () => {
    const { id } = useParams();
    const [code, setCode] = useState("// Write your code here");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [problem, setProblem] = useState(null);
    const [verdict, setVerdict] = useState("");
    const [submissions, setSubmissions] = useState([]);
    const [language, setLanguage] = useState("c");
    const [stats, setStats] = useState({ runtime: "", memory: "" });
    const [htmlDesc, setHtmlDesc] = useState("");
    const [aiFeedback, setAiFeedback] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const { isLoggedIn } = useContext(AuthContext);
    const now = new Date();

    useEffect(() => {
        if (!id) return;

        axios.get(`http://localhost:8000/api/v1/problems/${id}`)
            .then((res) => {
                setProblem(res.data);
                decodeHtml(res.data.problem_desc);
            })
            .catch((err) => console.error("Error fetching problem:", err));

        axios.get(`/api/compiler/submissions/${id}/`)
            .then((res) => {
                const data = res.data;
                if (Array.isArray(data)) {
                    setSubmissions(data);
                } else if (typeof data === "object" && data !== null) {
                    setSubmissions([data]);
                } else {
                    setSubmissions([]);
                }
            })
            .catch((err) => console.error("Error fetching submissions:", err));
    }, [id]);

    useEffect(() => {
        if (problem && code) {
            handleAutoAIAssist();
        }
    }, [problem, code]);

    const decodeHtml = (encodedStr) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = encodedStr;
        setHtmlDesc(txt.value);
    };

    const handleSubmit = () => {
        axios.post(`http://127.0.0.1:8000/api/v1/compiler/submit/`, {
            code,
            input_tests: input,
            problem_id: id,
            language,
        }).then((res) => {
            setOutput(res.data.output);
            setVerdict(res.data.verdict);
            setStats({
                runtime: res.data.runtime,
                memory: res.data.memory,
                timestamp: now.toLocaleString(),
            });
            res.data.timestamp = new Date().toLocaleString();
            setSubmissions((prev) => [res.data, ...prev]);
        }).catch((err) => {
            console.error("Submission error:", err);
        });
    };

    const handleRun = () => {
        axios.post(`http://127.0.0.1:8000/api/v1/compiler/`, {
            code,
            input_tests: input,
            problem_id: id,
            language,
        }).then((res) => {
            setOutput(res.data.output);
            setVerdict('Run Successful !');
            setStats({
                runtime: res.data.runtime,
                memory: res.data.memory,
                timestamp: now,
            });
            res.data.timestamp = new Date().toLocaleString();
            setSubmissions((prev) => [res.data, ...prev]);
        }).catch((err) => {
            console.error("Run error:", err);
        });
    };

    const handleAutoAIAssist = async () => {
        setAiLoading(true);
        setAiFeedback("");
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/v1/ai/analyze/", {
                prompt: `Review the following ${language} code for the problem titled: ${problem?.title}\nand my Code:${code}`
            });
            setAiFeedback(res.data.response || "No suggestions available.");
        } catch (error) {
            console.error("AI auto-review error:", error);
            setAiFeedback("AI analysis failed.");
        } finally {
            setAiLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="flex items-center justify-center h-screen">
                <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
                    Login to Practice
                </FuzzyText>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <h2 className="text-xl font-bold mb-2">
                        {problem ? `Title: ${problem.title}` : "Loading..."}
                    </h2>
                    <div className="mb-2 border p-2 rounded prose" dangerouslySetInnerHTML={{ __html: htmlDesc }}></div>

                    <div className="mt-10">
                        <h3 className="font-semibold text-green-600">Verdict: {verdict}</h3>
                        <p className="font-semibold text-green-600 text-sm">Runtime: {stats.runtime} ms</p>
                        <p className="font-semibold text-green-600 text-sm">Memory: {stats.memory} KB</p>
                    </div>


                    <label className="block font-semibold mt-4 mb-2">Input:</label>
                    <textarea
                        rows="2"
                        className="bg-gray-400 text-black w-full border rounded p-2"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></textarea>

                    <div className="mt-4">
                        <label className="block font-semibold mb-2">Output:</label>
                        <textarea
                            rows="2"
                            readOnly
                            className="bg-gray-300 text-black w-full border rounded p-2"
                            value={output}
                        ></textarea>
                    </div>

                    <div className="mt-4 flex gap-4 items-center">
                        <button
                            onClick={handleRun}
                            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                        >
                            <span className="px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                Run
                            </span>
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                        >
                            <span className="px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                Submit
                            </span>
                        </button>
                        <button
                            onClick={handleAutoAIAssist}
                            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                        >
                            <FaRobot className="text-green-500 text-3xl" />
                            <span className="px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                Ask AI
                            </span>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="font-semibold" htmlFor="codinglang">Coding in&nbsp;</label>
                    <select
                        id="codinglang"
                        className="border p-2 rounded mb-2"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>

                    <label className="block font-semibold mb-2">Code Editor:</label>
                    <Editor
                        height="600px"
                        language={language}
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        theme="vs-dark"
                        options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: true }}
                    />

                </div>
            </div>
            <div>
                {aiFeedback && (
                    <>
                        <div className="flex justify-center pt-2">
                            <h4 className="text-2xl font-semibold text-yellow-600 mb-2 flex items-center gap-2 bg-light text-center">
                                <FaRobot className="text-green-500" /> BubblAI Feedback
                            </h4>
                        </div>
                        <div className="mt-6 p-4 bg-dark text-light rounded shadow border border-gray-100 max-h-64 overflow-auto">
                            <div className="text-sm bg-dark text-gray-300">
                                <MarkdownRenderer>
                                    {aiFeedback}
                                </MarkdownRenderer>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="flex justify-center pt-2">
                <h4 className="text-2xl font-semibold text-yellow-600 mb-2 flex items-center gap-2 bg-light text-center">
                    <FaRobot className="text-green-500" /> Previous Submissions
                </h4>
            </div>
            <div className="mt-1 max-h-96 overflow-y-auto border rounded">
                <ul className="space-y-2">
                    {submissions.map((sub, idx) => (
                        <li key={idx} className="border p-2 rounded bg-white text-black shadow text-sm">
                            <p className="font-semibold">Submission ID: {submissions.length - idx}</p>
                            <p className="text-xs text-gray-500">Time: {sub.timestamp || "Timestamp not available"}</p>
                            <div className="bg-gray-400 text-black border w-full border rounded p-2">
                                Verdict: {sub.verdict}, Runtime: {sub.runtime} ms, Memory: {sub.memory} KB
                            </div>
                            <pre className="bg-gray-400 text-black border w-full border rounded p-2">
                                {sub.code}
                            </pre>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Compiler;