"""
🌱 Arjuna.exe - Agentic AI for Urban Greenery
Streamlit Application with Multi-Agent System Integration
"""

import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import folium
from streamlit_folium import st_folium
import plotly.express as px
import plotly.graph_objects as go
from agents import run_arjuna_workflow, process_natural_language_query

# Page configuration
st.set_page_config(
    page_title="🌱 Arjuna.exe - Agentic AI Urban Greenery",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #2E7D32;
        text-align: center;
        margin-bottom: 2rem;
    }
    .agent-message {
        padding: 1rem;
        margin: 0.5rem 0;
        border-radius: 10px;
        border-left: 4px solid #4CAF50;
        background-color: #F1F8E9;
    }
    .metric-card {
        background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem 0;
    }
    .score-high { color: #2E7D32; font-weight: bold; }
    .score-medium { color: #F57C00; font-weight: bold; }
    .score-low { color: #D32F2F; font-weight: bold; }
</style>
""", unsafe_allow_html=True)

@st.cache_data
def load_city_data():
    """Load and cache city data"""
    return pd.read_csv('city_data.csv')

def create_metrics_dashboard(city_data, recommendations):
    """Create metrics dashboard with visualizations"""
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="🌡️ Temperature", 
            value=f"{city_data['temperature']}°C",
            delta=f"{city_data['temperature'] - 30:.1f}° from comfort zone"
        )
    
    with col2:
        st.metric(
            label="💧 Humidity", 
            value=f"{city_data['humidity']}%",
            delta=f"{city_data['humidity'] - 60:.1f}% from optimal"
        )
    
    with col3:
        st.metric(
            label="🌧️ Rainfall", 
            value=f"{city_data['rainfall']}mm",
            delta=f"{city_data['rainfall'] - 25:.1f}mm from average"
        )
    
    with col4:
        st.metric(
            label="🌳 Green Cover", 
            value=f"{city_data['green_cover']}%",
            delta=f"{40 - city_data['green_cover']:.1f}% to target"
        )

def display_agent_conversation(conversation_log):
    """Display the agent reasoning timeline"""
    st.subheader("🤖 Agent Reasoning Timeline")
    
    for i, msg in enumerate(conversation_log):
        # Color coding for different agents
        colors = {
            "System": "#607D8B",
            "Climate Analyst": "#FF6B35", 
            "Ecological Planner": "#4CAF50",
            "Sustainability Advisor": "#2196F3"
        }
        
        color = colors.get(msg.agent, "#666")
        
        st.markdown(f"""
        <div style="border-left: 4px solid {color}; padding: 1rem; margin: 1rem 0; background-color: #f8f9fa; border-radius: 5px;">
            <strong style="color: {color};">[{msg.timestamp}] {msg.agent}:</strong><br>
            {msg.content}
        </div>
        """, unsafe_allow_html=True)

def create_environmental_chart(df):
    """Create environmental profile bar chart"""
    fig = go.Figure()
    
    # Add bars for each metric
    fig.add_trace(go.Bar(
        name='Current Values',
        x=['Temperature (°C)', 'Humidity (%)', 'Rainfall (mm)', 'Green Cover (%)'],
        y=[df['temperature'].iloc[0], df['humidity'].iloc[0], df['rainfall'].iloc[0], df['green_cover'].iloc[0]],
        marker_color=['#FF6B35', '#2196F3', '#4CAF50', '#8BC34A']
    ))
    
    fig.update_layout(
        title="Environmental Profile",
        xaxis_title="Environmental Factors",
        yaxis_title="Values",
        template="plotly_white"
    )
    
    return fig

def create_city_map(df, selected_city=None):
    """Create interactive map with city markers"""
    # Center map on India
    m = folium.Map(location=[23.5, 78.0], zoom_start=5)
    
    for idx, row in df.iterrows():
        # Color code based on green cover
        if row['green_cover'] >= 35:
            color = 'green'
            icon = 'leaf'
        elif row['green_cover'] >= 25:
            color = 'orange' 
            icon = 'tree'
        else:
            color = 'red'
            icon = 'exclamation-sign'
        
        # Create popup content
        popup_content = f"""
        <b>{row['city']}</b><br>
        🌡️ Temperature: {row['temperature']}°C<br>
        💧 Humidity: {row['humidity']}%<br>
        🌧️ Rainfall: {row['rainfall']}mm<br>
        🌳 Green Cover: {row['green_cover']}%
        """
        
        # Highlight selected city
        if selected_city and row['city'] == selected_city:
            folium.Marker(
                [row['lat'], row['lon']],
                popup=popup_content,
                icon=folium.Icon(color=color, icon=icon),
                tooltip=f"📍 {row['city']} (Selected)"
            ).add_to(m)
            
            # Add circle highlight for selected city
            folium.CircleMarker(
                [row['lat'], row['lon']],
                radius=20,
                color='purple',
                weight=3,
                fill=False
            ).add_to(m)
        else:
            folium.Marker(
                [row['lat'], row['lon']],
                popup=popup_content,
                icon=folium.Icon(color=color, icon=icon),
                tooltip=f"📍 {row['city']}"
            ).add_to(m)
    
    return m

def display_recommendations(recommendations):
    """Display final recommendations in organized format"""
    st.subheader("🎯 Final Recommendations")
    
    # Green Resilience Score
    score = recommendations.get('green_resilience_score', 0)
    score_color = 'score-high' if score >= 70 else 'score-medium' if score >= 40 else 'score-low'
    
    st.markdown(f"""
    <div class="metric-card">
        <h3>🏆 Green Resilience Score</h3>
        <h2 class="{score_color}">{score}/100</h2>
    </div>
    """, unsafe_allow_html=True)
    
    # Key recommendations in tabs
    tab1, tab2, tab3, tab4 = st.tabs(["💰 Cost & Timeline", "🌱 Quick Wins", "📊 Success Metrics", "🔮 Long-term Vision"])
    
    with tab1:
        cost = recommendations.get('total_cost_estimate', 0)
        st.write(f"**💰 Estimated Cost:** ₹{cost:,.0f}")
        
        timeline = recommendations.get('implementation_timeline', [])
        st.write("**📅 Implementation Timeline:**")
        for phase in timeline:
            st.write(f"• {phase}")
        
        st.write(f"**💧 Watering Schedule:** {recommendations.get('watering_schedule', 'Standard care')}")
    
    with tab2:
        quick_wins = recommendations.get('quick_wins', [])
        st.write("**🚀 Quick Wins (Start Immediately):**")
        for win in quick_wins:
            st.write(f"✅ {win}")
    
    with tab3:
        metrics = recommendations.get('success_metrics', {})
        st.write("**📈 Success Metrics to Track:**")
        for key, value in metrics.items():
            st.write(f"• **{key.replace('_', ' ').title()}:** {value}")
    
    with tab4:
        vision = recommendations.get('long_term_vision', '')
        st.write("**🌟 Long-term Vision:**")
        st.info(vision)
        
        risks = recommendations.get('implementation_risks', [])
        st.write("**⚠️ Key Risks to Monitor:**")
        for risk in risks:
            st.write(f"• {risk}")

def simulate_scenario(city_data, scenario_type, change_value):
    """Simulate future scenarios"""
    modified_data = city_data.copy()
    
    if scenario_type == "Temperature Increase":
        modified_data['temperature'] += change_value
    elif scenario_type == "Rainfall Change":
        modified_data['rainfall'] += change_value
    elif scenario_type == "Green Cover Improvement":
        modified_data['green_cover'] += change_value
    
    return modified_data

# Main application
def main():
    # Header
    st.markdown('<h1 class="main-header">🌱 Arjuna.exe – Agentic AI for Urban Greenery</h1>', unsafe_allow_html=True)
    st.markdown("*Intelligent multi-agent system for urban greenery monitoring and optimization*")
    
    # Load data
    df = load_city_data()
    
    # Sidebar controls
    st.sidebar.header("🎛️ Control Panel")
    
    # City selection
    selected_city = st.sidebar.selectbox(
        "🏙️ Select City for Analysis",
        df['city'].tolist(),
        index=0
    )
    
    # Get selected city data
    city_data = df[df['city'] == selected_city].iloc[0].to_dict()
    
    # Scenario simulation
    st.sidebar.subheader("🔮 Scenario Simulation")
    scenario_enabled = st.sidebar.checkbox("Enable Future Scenario Simulation")
    
    if scenario_enabled:
        scenario_type = st.sidebar.selectbox(
            "Scenario Type",
            ["Temperature Increase", "Rainfall Change", "Green Cover Improvement"]
        )
        
        if scenario_type == "Temperature Increase":
            change_value = st.sidebar.slider("Temperature increase (°C)", 0, 5, 2)
        elif scenario_type == "Rainfall Change": 
            change_value = st.sidebar.slider("Rainfall change (mm)", -20, 30, 10)
        else:  # Green Cover Improvement
            change_value = st.sidebar.slider("Green cover increase (%)", 0, 15, 5)
        
        city_data = simulate_scenario(city_data, scenario_type, change_value)
        st.sidebar.success(f"Simulating: {scenario_type} (+{change_value})")
    
    # Run Arjuna workflow
    with st.spinner(f"🚀 Arjuna.exe analyzing {selected_city}..."):
        recommendations, conversation_log = run_arjuna_workflow(city_data)
    
    # Main dashboard
    col1, col2 = st.columns([2, 1])
    
    with col1:
        # Metrics dashboard
        create_metrics_dashboard(city_data, recommendations)
        
        # Environmental profile chart
        st.subheader("📊 Environmental Profile")
        city_df = df[df['city'] == selected_city]
        fig = create_environmental_chart(city_df)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # Resilience score gauge
        score = recommendations.get('green_resilience_score', 0)
        fig_gauge = go.Figure(go.Indicator(
            mode = "gauge+number+delta",
            value = score,
            domain = {'x': [0, 1], 'y': [0, 1]},
            title = {'text': "Green Resilience Score"},
            delta = {'reference': 50},
            gauge = {
                'axis': {'range': [None, 100]},
                'bar': {'color': "#4CAF50"},
                'steps': [
                    {'range': [0, 30], 'color': "#FFCDD2"},
                    {'range': [30, 70], 'color': "#FFF9C4"}, 
                    {'range': [70, 100], 'color': "#C8E6C9"}],
                'threshold': {
                    'line': {'color': "red", 'width': 4},
                    'thickness': 0.75,
                    'value': 75}}))
        
        fig_gauge.update_layout(height=300)
        st.plotly_chart(fig_gauge, use_container_width=True)
    
    # Agent conversation timeline
    st.markdown("---")
    display_agent_conversation(conversation_log)
    
    # Final recommendations
    st.markdown("---")
    display_recommendations(recommendations)
    
    # Interactive map
    st.markdown("---")
    st.subheader("🗺️ Interactive City Map")
    
    tab1, tab2 = st.tabs(["Selected City Focus", "All Cities Comparison"])
    
    with tab1:
        # Focus on selected city
        city_map = create_city_map(df, selected_city)
        st_folium(city_map, width=700, height=400)
        
        st.info(f"📍 **{selected_city}** is highlighted with a purple circle. Marker colors indicate green cover levels: 🟢 High (35%+), 🟠 Medium (25-35%), 🔴 Low (<25%)")
    
    with tab2:
        # Show all cities
        all_cities_map = create_city_map(df)
        st_folium(all_cities_map, width=700, height=400)
        
        # Cities comparison chart
        st.subheader("🏙️ Cities Comparison")
        comparison_df = df.copy()
        
        # Calculate resilience scores for all cities
        resilience_scores = []
        for _, row in comparison_df.iterrows():
            city_dict = row.to_dict()
            temp_recommendations, _ = run_arjuna_workflow(city_dict)
            resilience_scores.append(temp_recommendations.get('green_resilience_score', 0))
        
        comparison_df['Resilience Score'] = resilience_scores
        
        fig_comparison = px.bar(
            comparison_df, 
            x='city', 
            y=['green_cover', 'Resilience Score'],
            title="Green Cover vs Resilience Score by City",
            barmode='group',
            color_discrete_sequence=['#4CAF50', '#FF6B35']
        )
        st.plotly_chart(fig_comparison, use_container_width=True)
    
    # Natural Language Query Interface
    st.markdown("---")
    st.subheader("💬 Ask Arjuna Anything")
    st.markdown("*Ask natural language questions about urban greenery for the selected city*")
    
    query = st.text_input(
        "Your question:",
        placeholder=f"e.g., How should we improve greenery in {selected_city} next month?",
        key="nl_query"
    )
    
    if query:
        with st.spinner("🤔 Arjuna is thinking..."):
            # Process the natural language query
            response = process_natural_language_query(query, city_data, recommendations)
            
            st.markdown("**🌱 Arjuna's Response:**")
            st.success(response)
    
    # Additional insights and export options
    st.markdown("---")
    st.subheader("📋 Additional Insights & Export")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("📊 Generate Full Report"):
            # Create comprehensive report
            report = f"""
# Arjuna.exe Analysis Report: {selected_city}

## Executive Summary
- **Green Resilience Score:** {recommendations.get('green_resilience_score', 0)}/100
- **Current Green Cover:** {city_data['green_cover']}%
- **Climate Challenge Level:** {recommendations.get('climate_challenge', 'Moderate')}

## Environmental Data
- Temperature: {city_data['temperature']}°C
- Humidity: {city_data['humidity']}%
- Rainfall: {city_data['rainfall']}mm
- Green Cover: {city_data['green_cover']}%

## Agent Recommendations Summary
{chr(10).join([f"- {msg.content}" for msg in conversation_log if msg.agent != "System"])}

## Implementation Cost
₹{recommendations.get('total_cost_estimate', 0):,.0f}

## Success Metrics
{chr(10).join([f"- {k.replace('_', ' ').title()}: {v}" for k, v in recommendations.get('success_metrics', {}).items()])}
            """
            
            st.download_button(
                label="📥 Download Report",
                data=report,
                file_name=f"arjuna_report_{selected_city.lower()}.md",
                mime="text/markdown"
            )
    
    with col2:
        if st.button("📈 Export Data"):
            # Create export data
            export_data = {
                'city': selected_city,
                'analysis_timestamp': pd.Timestamp.now(),
                'environmental_data': city_data,
                'recommendations': recommendations,
                'agent_messages': len(conversation_log)
            }
            
            st.download_button(
                label="📥 Download JSON",
                data=pd.Series(export_data).to_json(),
                file_name=f"arjuna_data_{selected_city.lower()}.json",
                mime="application/json"
            )
    
    with col3:
        if st.button("🔄 Refresh Analysis"):
            st.rerun()
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: #666; padding: 2rem;">
        <p>🌱 <strong>Arjuna.exe</strong> - Agentic AI for Urban Greenery</p>
        <p>Powered by Multi-Agent LangGraph System | Built for Sustainable Cities</p>
        <p><em>"Every tree planted today is a breath of fresh air for tomorrow"</em></p>
    </div>
    """, unsafe_allow_html=True)

# Run the application
if __name__ == "__main__":
    main()