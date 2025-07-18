
import React, { useState, useEffect } from 'react';
import { Check, Calendar, Target, Zap, Coffee, Book, Dumbbell, Droplets, Moon, Sun, Heart, Lightbulb, TrendingUp, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const Dashboard = () => {
  const [missions, setMissions] = useState([
    { id: 1, title: 'Wake by 6 AM', icon: Sun, completed: false, streak: 0 },
    { id: 2, title: 'Drink 3L of Water', icon: Droplets, completed: false, streak: 0 },
    { id: 3, title: 'New Learnings', icon: Lightbulb, completed: false, streak: 0 },
    { id: 4, title: 'No Screen After 8:30 PM', icon: Moon, completed: false, streak: 0 },
    { id: 5, title: 'Morning Mind Reset', icon: Heart, completed: false, streak: 0 },
    { id: 6, title: '10–15 Min Physical Activity', icon: Dumbbell, completed: false, streak: 0 },
    { id: 7, title: 'Read/Watch Something Educational', icon: Book, completed: false, streak: 0 },
    { id: 8, title: 'Eat 1 Nutritious Meal', icon: Zap, completed: false, streak: 0 },
    { id: 9, title: 'Reflect on the Day', icon: Heart, completed: false, streak: 0 },
    { id: 10, title: 'Connect with Someone Close', icon: Heart, completed: false, streak: 0 },
    { id: 11, title: 'Do 1 Task Toward Your Dream', icon: Target, completed: false, streak: 0 },
    { id: 12, title: 'Sleep Before 10:30 PM', icon: Moon, completed: false, streak: 0 }
  ]);

  const [completedCount, setCompletedCount] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }));

  const navigate = useNavigate();

  const motivationalQuotes = [
    "Discipline is the bridge between goals and accomplishment.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The groundwork for all happiness is good health.",
    "Excellence is not a skill, it's an attitude.",
    "Small daily improvements lead to staggering long-term results."
  ];

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    loadTodaysProgress();
    setCompletedCount(missions.filter(mission => mission.completed).length);
  }, [missions]);

  useEffect(() => {
    const quoteIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[quoteIndex]);
  }, []);

  const loadTodaysProgress = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('date', today);

      if (error) throw error;

      const updatedMissions = missions.map(mission => {
        const dbMission = data?.find(d => d.mission_name === mission.title);
        return {
          ...mission,
          completed: dbMission?.completed || false,
          streak: dbMission?.streak_count || 0
        };
      });

      setMissions(updatedMissions);
    } catch (error) {
      console.error('Error loading today\'s progress:', error);
    }
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
          <div className="flex items-center justify-end mb-4">
            <Button 
              onClick={() => navigate('/admin')} 
              variant="outline" 
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Admin Panel
            </Button>
          </div>

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
            </div>
          </div>
        </Card>

        {/* Missions Grid - Read Only for Public View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission, index) => {
            const IconComponent = mission.icon;
            return (
              <Card 
                key={mission.id}
                className={`mission-card ${mission.completed ? 'mission-completed' : ''} slide-up`}
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <IconComponent className={`h-6 w-6 ${mission.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {mission.streak} streak
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
