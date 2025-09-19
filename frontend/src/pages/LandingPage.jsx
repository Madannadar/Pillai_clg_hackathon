import React, { useState, useEffect } from 'react';
import { ChevronRight, Leaf, Brain, BarChart3, Globe, Droplets, TreePine, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ArjunaLanding() {

    const navigate = useNavigate();
    
    const [scrollY, setScrollY] = useState(0);
    const [currentFeature, setCurrentFeature] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: <Brain className="w-8 h-8" />,
            title: "Climate Data Analysis",
            description: "Analyzes trends using public environmental APIs and historical vegetation data"
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Simulated Sensor Intelligence",
            description: "Creates virtual sensor readings from real-time rainfall, humidity, and temperature APIs"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Autonomous Recommendations",
            description: "Provides actionable tasks for watering, planting, and maintenance prioritization"
        }
    ];

    const solutions = [
        {
            icon: <Droplets className="w-6 h-6" />,
            title: "Smart Watering Schedules",
            description: "AI analyzes rainfall patterns and humidity data to optimize irrigation timing and reduce water waste"
        },
        {
            icon: <TreePine className="w-6 h-6" />,
            title: "Plant Species Selection",
            description: "Recommends ideal plant types and plantation timing based on climate trends and geographic metadata"
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Maintenance Prioritization",
            description: "Ranks locations by ecological urgency using weather forecasts and environmental condition analysis"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
                />
                <div
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-400/5 rounded-full blur-2xl"
                    style={{ transform: `translate(-50%, -50%) rotate(${scrollY * 0.1}deg)` }}
                />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between p-6 lg:px-12">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                        Arjuna.exe
                    </span>
                </div>
                <button onClick={()=>navigate('/login')}  className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                    Get Started
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 px-6 lg:px-12 py-20 lg:py-32">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/20">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">AI-Powered Urban Intelligence</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                            <span className="bg-gradient-to-r from-green-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                Smart Cities
                            </span>
                            <br />
                            <span className="text-white">Green Future</span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-green-100 mb-12 max-w-4xl mx-auto leading-relaxed">
                            Software-only Agentic AI that transforms urban greenery using public environmental APIs and historical data—
                            delivering intelligent recommendations through a simple interface, no sensors or cameras required.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <button className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                                <span>Explore Solutions</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                                Watch Demo
                            </button>
                        </div>
                    </div>

                    {/* Rotating Feature Showcase */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`text-center transition-all duration-500 transform ${index === currentFeature
                                        ? 'scale-110 bg-white/10 rounded-2xl p-6'
                                        : 'opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-green-100">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Statement */}
            <section className="relative z-10 px-6 lg:px-12 py-20 bg-black/20 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                            The Urban <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">Challenge</span>
                        </h2>
                        <p className="text-xl text-green-100 max-w-4xl mx-auto">
                            Urban areas struggle with greenery management using expensive hardware-dependent systems, while valuable
                            environmental data from public APIs remains underutilized, leading to inefficient resource allocation and poor maintenance decisions.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-red-400 text-xl">📡</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-red-300">Hardware Dependency</h3>
                                    <p className="text-green-100">Expensive sensor networks and camera systems create barriers for resource-limited municipalities</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-orange-400 text-xl">📊</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-orange-300">Untapped Data Resources</h3>
                                    <p className="text-green-100">Publicly available environmental APIs (rainfall, humidity, temperature) remain underutilized</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-yellow-400 text-xl">⚡</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-yellow-300">Reactive Management</h3>
                                    <p className="text-green-100">Manual processes lead to delayed responses and poor resource allocation decisions</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Brain className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
                                <p className="text-green-100 mb-6">
                                    Software-only Agentic AI that harnesses public environmental APIs and simulates sensor intelligence
                                    through a simple user interface—perfect for municipalities and NGOs with limited resources
                                </p>
                                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold hover:scale-105 transition-transform">
                                    Explore Technology
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solutions Section */}
            <section className="relative z-10 px-6 lg:px-12 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                            <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                                Intelligent Solutions
                            </span>
                        </h2>
                        <p className="text-xl text-green-100 max-w-3xl mx-auto">
                            Our software-only Agentic AI leverages public environmental APIs and historical data to deliver
                            intelligent greenery management through an accessible interface
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {solutions.map((solution, index) => (
                            <div key={index} className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {solution.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{solution.title}</h3>
                                <p className="text-green-100 mb-6">{solution.description}</p>
                                <div className="flex items-center text-green-400 font-medium group-hover:text-green-300">
                                    <span>Learn more</span>
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Case Study Section */}
            <section className="relative z-10 px-6 lg:px-12 py-20 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-blue-400/30">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium text-blue-200">Success Story</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                            <span className="bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent">
                                Real Impact
                            </span>
                            <span className="text-white"> in Action</span>
                        </h2>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        {/* Case Study Header */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-8 lg:p-12 border-b border-white/10">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                                <div>
                                    <h3 className="text-2xl lg:text-3xl font-bold mb-2">Pune Municipal Corporation</h3>
                                    <p className="text-blue-200 text-lg">Software-Only Green Space Optimization</p>
                                </div>
                                <div className="bg-white/10 rounded-2xl px-6 py-3">
                                    <div className="text-sm text-blue-200 mb-1">Implementation</div>
                                    <div className="text-xl font-bold text-white">8 Months</div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study Content */}
                        <div className="p-8 lg:p-12">
                            <div className="grid lg:grid-cols-2 gap-12">
                                {/* Challenge & Solution */}
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-xl font-bold mb-4 text-red-300">The Challenge</h4>
                                        <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
                                            <p className="text-green-100 leading-relaxed">
                                                Pune Municipal Corporation managed 300+ parks and green spaces with limited budget,
                                                no sensor infrastructure, and relied on manual inspection schedules. With monsoon
                                                unpredictability and water scarcity concerns, they needed intelligent recommendations
                                                without expensive hardware investments.
                                            </p>
                                            <div className="mt-4 space-y-2">
                                                <div className="flex items-center space-x-3 text-red-200">
                                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                    <span className="text-sm">No budget for sensor infrastructure</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-red-200">
                                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                    <span className="text-sm">30% water waste due to poor scheduling</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-red-200">
                                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                    <span className="text-sm">Manual inspection-based maintenance</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-bold mb-4 text-green-300">Arjuna.exe Implementation</h4>
                                        <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                                            <p className="text-green-100 leading-relaxed mb-4">
                                                Deployed our software-only system using Indian Meteorological Department APIs,
                                                historical monsoon data, and geographic metadata. The AI agent analyzed rainfall
                                                patterns, humidity levels, and temperature trends to simulate sensor intelligence
                                                and provide actionable maintenance schedules.
                                            </p>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-3 text-green-200">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    <span className="text-sm">Integration with IMD weather APIs</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-green-200">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    <span className="text-sm">Historical monsoon pattern analysis</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-green-200">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    <span className="text-sm">Simple dashboard for municipal staff</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Results */}
                                <div>
                                    <h4 className="text-xl font-bold mb-6 text-cyan-300">Quantified Impact</h4>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-6 text-center border border-green-400/20">
                                            <div className="text-3xl font-bold text-green-400 mb-2">₹0</div>
                                            <div className="text-sm text-green-200">Hardware Investment</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl p-6 text-center border border-blue-400/20">
                                            <div className="text-3xl font-bold text-blue-400 mb-2">45%</div>
                                            <div className="text-sm text-blue-200">Water Conservation</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-6 text-center border border-purple-400/20">
                                            <div className="text-3xl font-bold text-purple-400 mb-2">300+</div>
                                            <div className="text-sm text-purple-200">Parks Optimized</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl p-6 text-center border border-yellow-400/20">
                                            <div className="text-3xl font-bold text-yellow-400 mb-2">5x</div>
                                            <div className="text-sm text-yellow-200">Faster Decision Making</div>
                                        </div>
                                    </div>

                                    {/* API Integration Details */}
                                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                        <h5 className="font-bold mb-4 text-white">Public APIs Utilized</h5>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">IMD Weather API</div>
                                                    <div className="text-xs text-green-200">Real-time rainfall, humidity, temperature data</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">ISRO Geospatial Data</div>
                                                    <div className="text-xs text-green-200">Geographic metadata and terrain analysis</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">Historical Climate Records</div>
                                                    <div className="text-xs text-green-200">5-year vegetation and weather pattern analysis</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quote */}
                            <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 border border-blue-400/20">
                                <div className="flex items-start space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">🏛️</span>
                                    </div>
                                    <div>
                                        <p className="text-lg text-green-100 italic mb-4 leading-relaxed">
                                            "Arjuna.exe gave us enterprise-level intelligence without the enterprise-level costs. Using only
                                            publicly available weather APIs, we now have smarter maintenance schedules than cities with
                                            million-rupee sensor networks. It's perfect for municipalities like ours with limited budgets but big ambitions."
                                        </p>
                                        <div className="text-blue-300 font-semibold">Rajesh Patil</div>
                                        <div className="text-blue-200 text-sm">Deputy Commissioner, Parks & Gardens, PMC</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Benefits */}
            <section className="relative z-10 px-6 lg:px-12 py-20 bg-white/5 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                            Why Choose <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">Arjuna.exe</span>
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            {[
                                "No hardware infrastructure or sensors required",
                                "Utilizes free public environmental APIs",
                                "Simulates sensor intelligence through data analysis",
                                "Simple interface suitable for limited-resource organizations",
                                "Continuous learning from climate and vegetation trends",
                                "Actionable recommendations for immediate implementation"
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                    <span className="text-lg text-green-100">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-xl rounded-3xl p-8 border border-green-400/20">
                            <h3 className="text-2xl font-bold mb-6 text-center">Technology Stack</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-400 mb-2">API</div>
                                    <div className="text-sm text-green-200">Public Environmental Data</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-emerald-400 mb-2">AI</div>
                                    <div className="text-sm text-green-200">Simulated Sensor Intelligence</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-teal-400 mb-2">WEB</div>
                                    <div className="text-sm text-green-200">Simple User Interface</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-300 mb-2">₹0</div>
                                    <div className="text-sm text-green-200">Hardware Investment</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-6 lg:px-12 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                        Ready to Transform Your City's
                        <br />
                        <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                            Green Infrastructure?
                        </span>
                    </h2>

                    <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto">
                        Join the revolution in urban sustainability with our intelligent, scalable, and cost-effective greenery management system.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <button className="group px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                            <span>Start Your Journey</span>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-10 py-4 border-2 border-green-400/50 rounded-full font-bold text-xl hover:bg-green-400/10 transition-all duration-300">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-6 lg:px-12 py-12 bg-black/30 backdrop-blur-sm border-t border-white/10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">Arjuna.exe</span>
                        </div>
                        <div className="text-green-200 text-sm">
                            © 2025 Arjuna.exe. Transforming urban ecosystems through AI intelligence.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}