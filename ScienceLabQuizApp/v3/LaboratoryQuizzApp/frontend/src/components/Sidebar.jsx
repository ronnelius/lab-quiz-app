import React from 'react'
import { sidebarStyles } from '../assets/dummyStyles.js'
import questionsData from '../assets/dummydata.js'
import { useState, useEffect, useRef } from 'react';
import { Globe, Layout, Code, Cpu, Database, Coffee,Menu, Terminal, Zap,CheckCircle ,XCircle , Target,Star, Sparkles, Trophy, Award, BookOpen, X, ChevronDown, ChevronRight } from 'lucide-react';
import {toast} from 'react-toastify';
import axios from 'axios';


    const API_BASE = 'https://lab-quiz-app.onrender.com';

const Sidebar = () => {
  const [selectedTech, setSelectedTech] = useState(null); 
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const submittedRef = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const asideRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  setIsLoggedIn(!!token);
}, []);


  //id the inner width is greater than 768px, open the sidebar by default, otherwise keep it closed
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
  handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //if this size is less than 768px and the sidebar is open, prevent body scroll, otherwise allow it
  useEffect(() => {
    if (window.innerWidth < 768) {
      if (isSidebarOpen) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  //Classification options
  const technologies = [
    {
      id: "glassware",
      name: "Glassware",
      icon: <BookOpen size={20} />,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: "measuring",
      name: "Measuring Instruments",
      icon: <Target size={20} />,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      id: "heating",
      name: "Heating Equipment",
      icon: <Zap size={20} />,
      color: "bg-red-50 text-red-600 border-red-200",
    },
  ];

  //individual equipment
const levels = {
  glassware: [
    {
      id: "beaker",
      name: "Beaker",
      videoId: "dQw4w9WgXcQ", // replace with actual YouTube video ID
      description: "A beaker is a simple container for stirring, mixing, and heating liquids in labs.",
      uses: [
        "Holding liquids",
        "Measuring approximate volumes",
        "Mixing chemicals"
      ]
    },
    {
      id: "flask",
      name: "Erlenmeyer Flask",
      videoId: "eY52Zsg-KVI",
      description: "A conical flask used to mix chemicals safely and minimize spillage.",
      uses: [
        "Mixing chemicals",
        "Heating liquids",
        "Titration experiments"
      ]
    }
  ],
  measuring: [
    {
      id: "graduated-cylinder",
      name: "Graduated Cylinder",
      videoId: "3KANI2dpXLw",
      description: "Used to measure precise volumes of liquids in the lab.",
      uses: [
        "Measuring liquid volumes accurately",
        "Preparing solutions"
      ]
    },
    {
      id: "thermometer",
      name: "Thermometer",
      videoId: "V-_O7nl0Ii0",
      description: "Used to measure temperature of liquids or surroundings in experiments.",
      uses: [
        "Measuring temperature of solutions",
        "Monitoring heating or cooling processes"
      ]
    }
  ],
  heating: [
    {
      id: "bunsen-burner",
      name: "Bunsen Burner",
      videoId: "lY2yjAdbvdQ",
      description: "A heat source used to perform experiments requiring flame or heat.",
      uses: [
        "Heating chemicals",
        "Sterilization",
        "Combustion experiments"
      ]
    }
  ]
};



 

  //Handle technology selection
    const handleTechSelect = (techId) => {
        //initial values are defined here
    if (selectedTech === techId) {
      setSelectedTech(null);
      setSelectedLevel(null);
    } else {
      setSelectedTech(techId);
      setSelectedLevel(null);
    }
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    submittedRef.current = false;

    if (window.innerWidth < 768) setIsSidebarOpen(true);

    setTimeout(() => {
      const el = asideRef.current?.querySelector(`[data-tech="${techId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    submittedRef.current = false;

    if (window.innerWidth < 768) setIsSidebarOpen(false);

  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = { 
        ...userAnswers, 
        [currentQuestion]: answerIndex };

    setUserAnswers(newAnswers);
    setTimeout(() => {
        if (currentQuestion < getQuestions().length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            setShowResults(true);
        }   
    }, 500 )
}

    const getQuestions = () => {
        if (!selectedLevel) return [];
        return questionsData[selectedLevel] || [];
    }


    //calculate the score by comparing user answers with correct answers
    const calculateScore = () => {
    const questions = getQuestions();
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: questions.length
        ? Math.round((correct / questions.length) * 100)
        : 0,
    };
  };



  //reset the quiz to initial state
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    submittedRef.current = false;
  };

  const questions = getQuestions();
  const currentQ = questions[currentQuestion];
  const score = calculateScore();

    const getPerformanceStatus = () => {
    if (score.percentage >= 90)
      return {
        text: "Outstanding!",
        color: "bg-gradient-to-r from-amber-200 to-amber-300",
        icon: <Sparkles className="text-amber-800" />,
      };
    if (score.percentage >= 75)
      return {
        text: "Excellent!",
        color: "bg-gradient-to-r from-blue-200 to-indigo-200",
        icon: <Trophy className="text-blue-800" />,
      };
    if (score.percentage >= 60)
      return {
        text: "Good Job!",
        color: "bg-gradient-to-r from-green-200 to-teal-200",
        icon: <Award className="text-green-800" />,
      };
    return {
      text: "Keep Practicing",
      color: "bg-gradient-to-r from-gray-200 to-gray-300",
      icon: <BookOpen className="text-gray-800" />,
    };
  };

  const performance = getPerformanceStatus();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token") ||
    localStorage.getItem("authToken") || null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

const submitResults = async () => {
  if (submittedRef.current) return;
  if(!selectedTech || !selectedLevel) return;

  const payload = {
    title: `${selectedLevel.toUpperCase()} quiz`,
    technology: selectedTech,
    level: selectedLevel,
    totalQuestions: score.total,
    correct: score.correct,
    wrong: score.total - score.correct,
  };

  console.log("Submitting payload:", payload); // 🔹 log it

  try {
      submittedRef.current = true;
      toast.info("Submitting your results...");
      const res = await axios.post(`${API_BASE}/api/results`, payload, {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
          timeout: 10000,
      });
      console.log("Server response:", res.data);
      if (res.data && res.data.success) toast.success("Results submitted successfully!");
      else {
          toast.warn("Unexpected server response while submitting results.");
          submittedRef.current = false;
      }
  } catch (err) {
      submittedRef.current = false;
      console.error("Error saving result:", err?.response?.data || err.message || err);
      toast.error("Could not save result. Check console or network.");
  }
};


    useEffect(() => {
    if (showResults) {
      submitResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showResults]);



    


  return (
    <div className={sidebarStyles.pageContainer}>
        {isSidebarOpen && (
            <div onClick={() => window.innerWidth< 768 && setIsSidebarOpen(false)}
                className = {sidebarStyles.mobileOverlay}>

            </div>
        
        )}

        <div className={sidebarStyles.mainContainer}>
          
{isLoggedIn ? (
          <aside ref={asideRef} className= {`${sidebarStyles.sidebar} ${
                isSidebarOpen ? 'tranlate-x-0' : '-translate-x-full'

            }`}>
                <div className={sidebarStyles.sidebarHeader}>
                    <div className={sidebarStyles.headerDecoration1}>

                    </div>
                    <div className={sidebarStyles.headerDecoration2}>

                    </div>
                    <div className={sidebarStyles.headerContent}>
                        <div className={sidebarStyles.logoContainer}>
                            <div className={sidebarStyles.logoIcon}>
                                <BookOpen size={28} className='text-indigo-700'/>
                            </div>
                            <div>
                                <h1 className={sidebarStyles.logoTitle}>Lab Quiz</h1>
                                <p className={sidebarStyles.logoSubtitle}>Practice and improve your skills</p>
                            </div>

                            <button onClick={toggleSidebar} className={sidebarStyles.closeButton}>
                                <X size={20} />
                            </button>
                        </div>
                    </div>



                </div>
                <div className={sidebarStyles.sidebarContent}>
                        <div className={sidebarStyles.technologiesHeader}>
                            <h2 className={sidebarStyles.technologiesTitle}>Technologies</h2>
                            <span className={sidebarStyles.technologiesCount}>
                                {technologies.length} options</span>

                        </div>
                    {technologies.map((tech) => (
                        <div 
                        key={tech.id} 
                        className={sidebarStyles.techItem} 
                        data-tech={tech.id}
                        >
                            <button 
                            onClick={() => handleTechSelect(tech.id)} 
                            className={`${sidebarStyles.techButton} ${
                                selectedTech === tech.id 
                                ? `${tech.color} ${sidebarStyles.techButtonSelected}`
                                : sidebarStyles.techButtonNormal
                                 }`}
                            >
                                <div className={sidebarStyles.techButtonContent}>
                                    <span className={`${sidebarStyles.techIcon} ${tech.color}`}>
                                     {tech.icon}
                                    </span>
                                    
                                    <span className={sidebarStyles.techName}>
                                        {tech.name}

                                    </span>
                                </div>

                                {selectedTech === tech.id ? (
                                    <ChevronDown size = {18} className='text-current'/>
                                    
                                ) : (
                                    <ChevronRight size={18} className='text-gray-400'/>

                                )}
                            
                            </button>

                            {selectedTech === tech.id && (
                              <div className={sidebarStyles.levelsContainer}>
                                <h3 className={sidebarStyles.levelsTitle}>
                                  <span>Select Equipment</span>
                                  <span className={sidebarStyles.techBadge}>
                                    {technologies.find((t) => t.id === selectedTech).name}
                                  </span>
                                </h3>
                                {levels[selectedTech]?.map((level) => (
                                  <button 
                                    key={level.id} 
                                    onClick={() => handleLevelSelect(level.id)} 
                                    className={`${
                                      sidebarStyles.levelButton
                                    } ${
                                      selectedLevel === level.id 
                                        ? `${level.color || ""} ${sidebarStyles.levelButtonSelected}` 
                                        : sidebarStyles.levelButtonNormal
                                    }`}
                                  >
                                    <div className={sidebarStyles.levelButtonContent}>
                                      <span className={`${sidebarStyles.levelIcon} ${
                                        selectedLevel === level.id ? 'text-white/40' : 'bg-gray-100'
                                      }`}>
                                        {level.icon || <BookOpen size={16} />}
                                      </span>
                                      <span>{level.name}</span>
                                    </div>
                                    <span className={sidebarStyles.levelQuestions}>
                                      {level.questions || 0} Qs
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}

                        </div>
                    ))}
                </div>               
                
                <div className={sidebarStyles.sidebarFooter}>
                    <div className={sidebarStyles.footerContent}>
                        <div className={sidebarStyles.footerContentCenter}>
                            <p>Learn the use of each Laboratory Equipment and Apparatus</p>
                            <p className={sidebarStyles.footerHighlight}>Learn Continuously</p>

                        </div>

                    </div>
                </div>

            </aside>
            ) : (
  <div className="p-6 text-center text-gray-500">
    <p>Please log in to access the sidebar and quizzes.</p>
  </div>
)}
{/* Mobile hamburger menu */}
{window.innerWidth < 768 && (
  <button
    onClick={toggleSidebar}
    className="fixed bottom-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-md shadow-md"
  >
    <Menu size={24} />
  </button>
)}


        {/* QUESTION AND ANSWER ALSO RESULT */}
<main className={sidebarStyles.mainContent}>

  {/* Home / Landing Info */}
  {!selectedTech && !selectedLevel && !showQuiz && (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Lab Quiz</h1>
      <p className="mb-4 text-gray-700">
        Practice your laboratory skills and learn the uses of different equipment. 
        Select a technology from the sidebar to get started.
      </p>

      {/* <div className="mt-6 grid gap-4 md:grid-cols-3">
        {technologies.map((tech) => (
          <div key={tech.id} className="p-4 rounded shadow hover:shadow-lg transition cursor-pointer" onClick={() => handleTechSelect(tech.id)}>
            <div className={`w-12 h-12 flex items-center justify-center mb-2 rounded-full ${tech.color}`}>
              {tech.icon}
            </div>
            <h3 className="text-lg font-semibold">{tech.name}</h3>
            <p className="text-gray-500 text-sm">Learn about {tech.name}</p>
          </div>
        ))}
      </div> */}
    </div>
  )}

  {/* Show Equipment Details */}
  {selectedTech && selectedLevel && !showQuiz && (() => {
    const equipment = levels[selectedTech]?.find(eq => eq.id === selectedLevel);
    if (!equipment) return null;

    return (
      <div className="p-6">
        {/* Equipment Name */}
        <h1 className="text-3xl font-bold mb-4">{equipment.name}</h1>

        {/* Video */}
        {equipment.videoId && (
          <div className="mb-6">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${equipment.videoId}`}
              title={`${equipment.name} Tutorial`}
              allowFullScreen
            />
          </div>
        )}

        {/* Description & Uses */}
        <div className="bg-white p-6 rounded shadow">
          {equipment.description && (
            <>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p>{equipment.description}</p>
            </>
          )}

          {equipment.uses?.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-4 mb-2">Uses</h2>
              <ul className="list-disc ml-6">
                {equipment.uses.map((use, index) => (
                  <li key={index}>{use}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Start Quiz Button */}
        <button
          onClick={() => setShowQuiz(true)}
          className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Start Quiz
        </button>
      </div>
    );
  })()}

  {/* Quiz Section */}
  {showQuiz && selectedLevel && (
    <div className="p-6">
      {showResults ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
          <p>
            You answered {score.correct} out of {score.total} questions correctly.
          </p>
          <p>Score: {score.percentage}%</p>
          <div className={`mt-4 p-4 rounded ${performance.color}`}>
            <div className="flex items-center gap-2">
              {performance.icon}
              <span className="font-semibold">{performance.text}</span>
            </div>
          </div>
          <button
            onClick={() => {
              resetQuiz();
              setShowQuiz(false);
            }}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded"
          >
            Back to Equipment
          </button>
        </div>
      ) : currentQ ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Question {currentQuestion + 1}</h2>
          <p className="mb-4">{currentQ.question}</p>
          <div className="flex flex-col gap-3">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>No questions available for this equipment.</p>
      )}
    </div>
  )}
</main>



        </div>

        <style>{sidebarStyles.customStyles}</style>
        

    </div>
  )
}

export default Sidebar;
