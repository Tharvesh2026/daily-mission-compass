
import React, { useState, useEffect } from 'react';
import { Check, Calendar, Target, Zap, Coffee, Book, Dumbbell, Droplets, Moon, Sun, Heart, Lightbulb, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [missions, setMissions] = useState([
    { id: 1, title: 'Wake up early (5-6 AM)', icon: Sun, completed: false, streak: 7 },
    { id: 2, title: 'Drink 3L+ water daily', icon: Droplets, completed: false, streak: 12 },
    { id: 3, title: '30+ minutes exercise', icon: Dumbbell, completed: false, streak: 5 },
    { id: 4, title: 'Read for 30+ minutes', icon: Book, completed: false, streak: 15 },
    { id: 5, title: 'No caffeine after 2 PM', icon: Coffee, completed: false, streak: 8 },
    { id: 6, title: 'No screens 1hr before bed', icon: Moon, completed: false, streak: 3 },
    { id: 7, title: 'Practice gratitude', icon: Heart, completed: false, streak: 20 },
    { id: 8, title: 'Learn something new', icon: Lightbulb, completed: false, streak: 6 },
    { id: 9, title: 'Work on main goal', icon: Target, completed: false, streak: 9 },
    { id: 10, title: 'Healthy meal choices', icon: Zap, completed: false, streak: 11 },
    { id: 11, title: 'Connect with someone', icon: Heart, completed: false, streak: 4 },
    { id: 12, title: 'Plan tomorrow', icon: Calendar, completed: false, streak: 13 }
  ]);

  const [completedCount, setCompletedCount] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }));

  const motivationalQuotes = [
    "Discipline is the bridge between goals and accomplishment.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The groundwork for all happiness is good health.",
    "Excellence is not a skill, it's an attitude.",
    "Small daily improvements lead to staggering long-term results."
  ];

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    setCompletedCount(missions.filter(mission => mission.completed).length);
  }, [missions]);

  useEffect(() => {
    const quoteIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[quoteIndex]);
  }, []);

  const toggleMission = (id) => {
    setMissions(missions.map(mission => 
      mission.id === id 
        ? { ...mission, completed: !mission.completed }
        : mission
    ));
  };

  const calculateProgress = () => {
    return Math.round((completedCount / missions.length) * 100);
  };

  const getProgressColor = () => {
    const progress = calculateProgress();
    if (progress >= 80) return 'text-green-400';
    if (progress >= 60) return 'text-yellow-400';
    return 'text-blue-400';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 slide-up">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Daily Mission Compass
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Building discipline through structured daily habits
          </p>
          <p className="text-sm text-muted-foreground">
            {currentDate}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">By</span>
            <Badge variant="outline" className="border-primary text-primary">
              Xplore With Tharvesh
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-2">Today's Progress</h2>
              <p className="text-muted-foreground mb-4">
                "{currentQuote}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold ${getProgressColor()}`}>
                  {completedCount}/{missions.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  missions completed
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center">
                <div className={`text-2xl font-bold ${getProgressColor()}`}>
                  {calculateProgress()}%
                </div>
              </div>
              <div 
                className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-primary border-t-transparent transform -rotate-90 transition-all duration-1000"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((calculateProgress() * 3.6 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((calculateProgress() * 3.6 - 90) * Math.PI / 180)}%, 50% 50%)`
                }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission, index) => {
            const IconComponent = mission.icon;
            return (
              <Card 
                key={mission.id}
                className={`mission-card ${mission.completed ? 'mission-completed' : ''} slide-up cursor-pointer`}
                style={{ animationDelay: `${0.1 * index}s` }}
                onClick={() => toggleMission(mission.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <IconComponent className={`h-6 w-6 ${mission.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {mission.streak} day streak
                    </Badge>
                    {mission.completed && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center check-bounce">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className={`font-semibold mb-2 ${mission.completed ? 'text-primary' : 'text-foreground'}`}>
                  {mission.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${mission.completed ? 'text-primary/80' : 'text-muted-foreground'}`}>
                    {mission.completed ? 'Completed ✓' : 'Pending'}
                  </span>
                  <TrendingUp className={`h-4 w-4 ${mission.streak > 10 ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground space-y-2 slide-up" style={{ animationDelay: '0.8s' }}>
          <p>Consistency is the key to transformation</p>
          <p className="text-xs">© 2024 Xplore With Tharvesh - Building better habits, one day at a time</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
