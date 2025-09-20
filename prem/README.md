# 🌱 Arjuna.exe - Agentic AI for Urban Greenery

An intelligent multi-agent system for urban greenery monitoring and optimization, built with Streamlit and designed for scalable city planning.

## ✨ Key Features

- **🤖 Multi-Agent Intelligence**: Three specialized AI agents collaborate to analyze climate, plan ecology, and provide sustainability recommendations
- **📊 Interactive Dashboard**: Real-time metrics, visualizations, and city comparisons
- **🗺️ Interactive Mapping**: Folium-powered maps with city markers and green cover analysis
- **💬 Natural Language Queries**: Ask questions in plain English and get intelligent responses
- **🔮 Scenario Simulation**: Model future climate changes and their impact on urban greenery
- **📈 Green Resilience Scoring**: Proprietary 0-100 scoring system for city green health

## 🏗️ Architecture

### Multi-Agent System (agents.py)
1. **Climate Analyst Agent** 🌡️
   - Analyzes temperature, humidity, rainfall data
   - Calculates water demand and climate stress levels
   - Provides weather/climate interpretation

2. **Ecological Planner Agent** 🌳
   - Recommends tree species based on climate analysis
   - Creates plantation strategies and intervention plans
   - Calculates trees needed and prioritizes zones

3. **Sustainability Advisor Agent** 🎯
   - Generates final actionable recommendations
   - Estimates costs and implementation timelines
   - Provides watering schedules and success metrics

### Workflow
```
City Data → Climate Analysis → Ecological Planning → Sustainability Recommendations
```

## 🚀 Installation & Setup

### 1. Clone or Download Files
Ensure you have these files in your project directory:
- `app.py` (main Streamlit application)
- `agents.py` (multi-agent system)
- `city_data.csv` (environmental data)
- `requirements.txt` (dependencies)

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Application
```bash
streamlit run app.py
```

The app will open in your browser at `http://localhost:8501`

## 📁 File Structure

```
arjuna-exe/
├── app.py                 # Main Streamlit application
├── agents.py              # Multi-agent system implementation
├── city_data.csv          # Sample city environmental data
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🎮 How to Use

### 1. Select a City
Choose from available cities (Bangalore, Delhi, Mumbai, Chennai, Kolkata) in the sidebar dropdown.

### 2. View Analysis
The system automatically runs the multi-agent workflow and displays:
- Environmental metrics dashboard
- Agent reasoning timeline
- Green Resilience Score (0-100)
- Interactive city map

### 3. Explore Recommendations
Review detailed recommendations across multiple tabs:
- **Cost & Timeline**: Budget estimates and implementation phases
- **Quick Wins**: Immediate actions to take
- **Success Metrics**: KPIs to track progress
- **Long-term Vision**: Strategic transformation goals

### 4. Natural Language Queries
Ask questions like:
- "How should we improve greenery in Delhi next month?"
- "What's the cost of implementing this plan?"
- "Which trees should we plant in Mumbai?"

### 5. Scenario Simulation
Enable future scenario simulation in the sidebar to model:
- Temperature increases (+0-5°C)
- Rainfall changes (±20-30mm)
- Green cover improvements (+0-15%)

## 🌟 Sample Outputs

### Green Resilience Score Calculation
```python
score = (temperature_score + rainfall_score + green_cover_score) / 3 - stress_penalties
# Example: Bangalore = 68/100 (Good resilience)
# Example: Delhi = 45/100 (Needs improvement)
```

### Agent Conversation Example
```
[10:30:15] Climate Analyst: 🌡️ High heat stress, moderate water stress. Trees need 145L/week.
[10:30:16] Ecological Planner: 🌳 Plant 800 Neem trees to reach 30% green cover.
[10:30:17] Sustainability Advisor: 🎯 Resilience Score 45/100. Cost ₹6,00,000. 4-phase implementation.
```

## 🔧 Customization

### Adding New Cities
Edit `city_data.csv`:
```csv
city,temperature,humidity,rainfall,green_cover,lat,lon
YourCity,35,60,25,30,12.34,56.78
```

### Modifying Agent Logic
Update agent methods in `agents.py`:
- `ClimateAnalystAgent.analyze_climate()`
- `EcologicalPlannerAgent.plan_ecology()`
- `SustainabilityAdvisorAgent.advise_sustainability()`

### Custom Visualizations
Add new charts in `app.py` using:
- Plotly for interactive charts
- Matplotlib for static plots
- Folium for maps

## 🧠 Future Enhancements

### Phase 2: Real LangGraph Integration
```python
# Replace simplified agents with actual LangGraph
from langgraph import StateGraph, END
from langchain.agents import AgentExecutor
```

### Phase 3: Advanced Features
- **Real-time satellite data** integration
- **IoT sensor** connectivity for live environmental monitoring  
- **Machine learning** models for predictive analytics
- **Multi-city comparison** algorithms
- **Citizen engagement** portal
- **API endpoints** for city government integration

## 📊 Technical Specifications

- **Frontend**: Streamlit 1.28.0
- **Data Processing**: Pandas, NumPy
- **Visualizations**: Plotly, Matplotlib, Folium
- **Architecture**: Multi-agent collaborative system
- **Scalability**: Designed for 100+ cities
- **Performance**: <3 seconds analysis per city

## 🏆 Hackathon Demo Script

1. **Opening** (30s): "Meet Arjuna.exe - not just rules, but reasoning AI agents"
2. **City Selection** (30s): Choose Delhi, show environmental stress
3. **Agent Timeline** (60s): Watch 3 agents collaborate in real-time
4. **Recommendations** (45s): Show cost, timeline, quick wins
5. **Natural Language** (30s): Ask "How to improve Delhi's greenery?"
6. **Scenario Simulation** (45s): Increase temperature by 3°C, see impact

**Total Demo Time**: 4 minutes

## 🤝 Contributing

Contributions welcome! Focus areas:
- Real LangGraph integration
- New visualization types
- Additional environmental factors
- Mobile responsiveness
- Performance optimizations

## 📜 License

Open source - feel free to adapt for your city planning needs!

---

**🌱 "Every tree planted today is a breath of fresh air for tomorrow" - Arjuna.exe**