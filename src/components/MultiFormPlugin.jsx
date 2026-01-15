import { useState, useEffect } from "react";

export default function MultiFormPlugin() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    siteName: "",
    username: "",
    email: "",
    apiKey: "",
  });

  const [savedCards, setSavedCards] = useState([]);
  const [showApiKey, setShowApiKey] = useState(false);
  const [visibleCardKeys, setVisibleCardKeys] = useState({});

  // 🔥 LOAD SAVED CARDS
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pluginCards");
      if (saved) {
        setSavedCards(JSON.parse(saved));
      }
    } catch (error) {
      console.log("No saved cards found");
    }
  }, []);

  // 🔥 SAVE CARDS (remove this useEffect as we're handling save in handleSave)
  // useEffect removed - save handled directly in handleSave function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔒 VALIDATION
  const canProceed =
    (step === 1 && formData.siteName) ||
    (step === 2 && formData.username && formData.email) ||
    (step === 3 && formData.apiKey) ||
    step === 4;

  // 🔥 SAVE & CREATE CARD
  const handleSave = () => {
    const newCard = {
      id: Date.now(),
      ...formData,
    };

    const updatedCards = [...savedCards, newCard];
    
    try {
      localStorage.setItem("pluginCards", JSON.stringify(updatedCards));
      setSavedCards(updatedCards);
      
      // Reset form
      setStep(1);
      setFormData({
        siteName: "",
        username: "",
        email: "",
        apiKey: "",
      });
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save configuration. Please try again.");
    }
  };

  // 🔥 DELETE CARD
  const handleDelete = (id) => {
    const updated = savedCards.filter((card) => card.id !== id);
    
    try {
      if (updated.length === 0) {
        localStorage.removeItem("pluginCards");
      } else {
        localStorage.setItem("pluginCards", JSON.stringify(updated));
      }
      setSavedCards(updated);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete configuration. Please try again.");
    }
  };

  // 🔥 TOGGLE API KEY VISIBILITY FOR CARDS
  const toggleCardKeyVisibility = (cardId) => {
    setVisibleCardKeys(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 HEADER */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🔌 Smart Plugin Manager
          </h1>
          <p className="text-sm md:text-base text-gray-600">Professional Configuration System</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* 📝 LEFT: FORM SECTION */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 h-fit order-1">
            
            {/* 🔹 PROGRESS BAR */}
            <div className="mb-6">
              <div className="hidden md:flex justify-between text-xs text-gray-500 mb-2">
                <span>General</span>
                <span>User Details</span>
                <span>API</span>
                <span>Review</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">
                Step {step} of 4
              </p>
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
              Configuration Wizard
            </h2>

            {/* FORM 1 */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-semibold text-lg text-gray-700 mb-4">🌐 General Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Site Name *
                  </label>
                  <input
                    name="siteName"
                    placeholder="Enter your site name"
                    value={formData.siteName}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 focus:border-blue-500 p-3 rounded-lg outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* FORM 2 */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-semibold text-lg text-gray-700 mb-4">👤 User Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Username *
                  </label>
                  <input
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 focus:border-blue-500 p-3 rounded-lg outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 focus:border-blue-500 p-3 rounded-lg outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* FORM 3 */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-semibold text-lg text-gray-700 mb-4">🔑 API Integration</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    API Key *
                  </label>
                  <div className="relative">
                    <input
                      name="apiKey"
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter your API key"
                      value={formData.apiKey}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 focus:border-blue-500 p-3 pr-12 rounded-lg outline-none transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showApiKey ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Your API key will be securely stored
                  </p>
                </div>
              </div>
            )}

            {/* FORM 4 */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-semibold text-lg text-gray-700 mb-4">✅ Review & Submit</h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Site Name</p>
                      <p className="font-semibold text-gray-800">{formData.siteName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Username</p>
                      <p className="font-semibold text-gray-800">{formData.username}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">API Key</p>
                      <p className="font-mono text-sm text-gray-600">{"•".repeat(formData.apiKey.length)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <span className="text-xl">✓</span>
                  <span className="font-medium">All settings are ready to save</span>
                </div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex justify-between mt-8 gap-3 md:gap-4">
              <button
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="px-4 md:px-6 py-2 md:py-3 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition text-sm md:text-base"
              >
                ← Back
              </button>

              {step < 4 ? (
                <button
                  disabled={!canProceed}
                  onClick={() => setStep(step + 1)}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed font-medium transition text-sm md:text-base"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition shadow-lg text-sm md:text-base"
                >
                  💾 Save
                </button>
              )}
            </div>
          </div>

          {/* 💾 RIGHT: SAVED CARDS SECTION */}
          <div className="order-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:sticky lg:top-8">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <span>📦</span> Saved Configurations
              </h3>

              {savedCards.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <div className="text-5xl md:text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-sm md:text-base">No configurations saved yet</p>
                  <p className="text-xs md:text-sm text-gray-400 mt-2">
                    Complete the form to create your first configuration
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] md:max-h-[600px] overflow-y-auto pr-2">
                  {savedCards.map((card, index) => (
                    <div
                      key={card.id}
                      className="border-2 border-gray-200 hover:border-blue-400 rounded-xl p-4 md:p-5 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl md:text-2xl">🔌</span>
                          <span className="font-bold text-gray-400 text-sm md:text-base">#{index + 1}</span>
                        </div>
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 md:p-2 rounded-lg transition text-xl"
                          title="Delete configuration"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">SITE NAME</p>
                          <p className="font-semibold text-gray-800 text-sm md:text-base break-words">{card.siteName}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 font-medium">USERNAME</p>
                            <p className="text-xs md:text-sm text-gray-700 break-words">{card.username}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">EMAIL</p>
                            <p className="text-xs md:text-sm text-gray-700 break-all">{card.email}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">API KEY</p>
                          <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                            <p className="text-xs font-mono text-gray-600 flex-1 break-all">
                              {visibleCardKeys[card.id] 
                                ? card.apiKey 
                                : card.apiKey.substring(0, 8) + "•".repeat(Math.min(20, card.apiKey.length))
                              }
                            </p>
                            <button
                              onClick={() => toggleCardKeyVisibility(card.id)}
                              className="text-sm hover:bg-gray-200 p-1 rounded transition flex-shrink-0"
                              title={visibleCardKeys[card.id] ? "Hide API key" : "Show API key"}
                            >
                              {visibleCardKeys[card.id] ? "🙈" : "👁️"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-400">
                          Created: {new Date(card.id).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}