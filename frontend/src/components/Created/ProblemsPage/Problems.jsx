import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Galaxy from "../../Galaxy/Galaxy";
const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
    return (
        <motion.div
            ref={ref}
            data-index={index}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.2, delay }}
            className="cursor-pointer"
        >
            {children}
        </motion.div>
    );
};

const getColorByLevel = (level) => {
    switch (level?.toLowerCase()) {
        case "easy":
            return "border-green-500 bg-green-700 hover:bg-green-800";
        case "medium":
            return "border-yellow-500 bg-yellow-600 hover:bg-yellow-700";
        case "hard":
            return "border-red-500 bg-red-700 hover:bg-red-800";
        case "extreme":
            return "border-purple-700 bg-purple-700 hover:bg-purple-800";
        default:
            return "border-gray-700 bg-gray-700 hover:bg-gray-800";
    }
};

function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export default function AnimatedProblemList() {
    const listRef = useRef(null);
    const navigate = useNavigate();

    const [problems, setProblems] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [keyboardNav, setKeyboardNav] = useState(false);
    const [topGradientOpacity, setTopGradientOpacity] = useState(0);
    const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

    useEffect(() => {
        axios.get("http://localhost:8000/api/v1/problems/")
            .then((res) => {
                const sorted = res.data.sort((a, b) =>
                    new Date(a.created_at) - new Date(b.created_at)
                );
                setProblems(sorted);
            })
            .catch((err) => console.error("Error fetching problems", err));
    }, []);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        setTopGradientOpacity(Math.min(scrollTop / 50, 1));
        const bottomDistance = scrollHeight - (scrollTop + clientHeight);
        setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
    };

    const handleProblemSelect = (problemId) => {
        navigate(`/problems/${problemId}`);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
                e.preventDefault();
                setKeyboardNav(true);
                setSelectedIndex((prev) => Math.min(prev + 1, problems.length - 1));
            } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
                e.preventDefault();
                setKeyboardNav(true);
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter" && selectedIndex >= 0) {
                e.preventDefault();
                handleProblemSelect(problems[selectedIndex].id);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, problems]);

    useEffect(() => {
        if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
        const container = listRef.current;
        const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
        if (selectedItem) {
            const extraMargin = 50;
            const containerScrollTop = container.scrollTop;
            const containerHeight = container.clientHeight;
            const itemTop = selectedItem.offsetTop;
            const itemBottom = itemTop + selectedItem.offsetHeight;
            if (itemTop < containerScrollTop + extraMargin) {
                container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
            } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
                container.scrollTo({
                    top: itemBottom - containerHeight + extraMargin,
                    behavior: "smooth",
                });
            }
        }
        setKeyboardNav(false);
    }, [selectedIndex, keyboardNav]);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <div className="absolute top-0 left-0 z-0 w-full h-full">
                <Galaxy
                    mouseRepulsion={true}
                    mouseInteraction={false}
                    density={1.5}
                    glowIntensity={0.5}
                    saturation={0.8}
                    hueShift={240}
                />
            </div>
            <div className="relative z-10 w-full max-w-6xl mx-auto pt-10">
                <div
                    ref={listRef}
                    onScroll={handleScroll}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto px-4 py-6
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-thumb]:bg-neutral-800
                  [&::-webkit-scrollbar-track]:bg-black"
                >
                    {problems.map((problem, index) => (
                        <AnimatedItem
                            key={problem.id}
                            index={index}
                            delay={0.05 * index}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => handleProblemSelect(problem.id)}
                        >
                            <div
                                className={`p-4 rounded-xl text-white transition-all duration-200 border-l-8 ${getColorByLevel(problem.problem_level)} ${selectedIndex === index ? "ring-2 ring-white" : ""
                                    }`}
                            >
                                <h2 className="text-xl font-bold mb-2">#{index+1} {problem.title}</h2>
                                <p className="text-sm mb-1"><span className="font-medium">{problem.problem_level}</span></p>
                                <p className="text-sm mb-1">Points: {problem.points_awarded}</p>
                                <p className="text-sm mb-1">{problem.accuracy || 0}% Solved</p>
                            </div>
                        </AnimatedItem>
                    ))}
                </div>
                <div
                    className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black to-transparent pointer-events-none"
                    style={{ opacity: topGradientOpacity }}
                />
                <div
                    className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none"
                    style={{ opacity: bottomGradientOpacity }}
                />
            </div>
        </div>
    );
}