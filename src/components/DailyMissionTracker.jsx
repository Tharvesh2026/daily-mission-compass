
import React, { useState, useEffect } from 'react';
import { Check, Calendar, Target, Zap, Coffee, Book, Dumbbell, Droplets, Moon, Sun, Heart, Lightbulb, TrendingUp, Share2, LogOut, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DailyMissionTracker = ({ onLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
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
  const [monthlyStats, setMonthlyStats] = useState({ total: 0, completed: 0, rate: 0 });
  const { toast } = useToast();

  const motivationalQuotes = [
    "Discipline is the bridge between goals and accomplishment.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The groundwork for all happiness is good health.",
    "Excellence is not a skill, it's an attitude.",
    "Small daily improvements lead to staggering long-term results."
  ];

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    const quoteIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[quoteIndex]);
  }, [selectedDate]);

  useEffect(() => {
    loadProgressForDate(selectedDate);
    loadMonthlyStats();
  }, [selectedDate]);

  useEffect(() => {
    setCompletedCount(missions.filter(mission => mission.completed).length);
  }, [missions]);

  const loadProgressForDate = async (date) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('date', dateStr);

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
      console.error('Error loading progress:', error);
    }
  };

  const loadMonthlyStats = async () => {
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      
      const { data, error } = await supabase
        .from('monthly_analytics')
        .select('*')
        .eq('month', month)
        .eq('year', year)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setMonthlyStats({
          total: data.total_missions,
          completed: data.completed_missions,
          rate: data.completion_rate
        });
      }
    } catch (error) {
      console.error('Error loading monthly stats:', error);
    }
  };

  const toggleMission = async (id) => {
    const mission = missions.find(m => m.id === id);
    const newCompleted = !mission.completed;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    try {
      const { error } = await supabase
        .from('missions')
        .upsert({
          date: dateStr,
          mission_name: mission.title,
          completed: newCompleted
        }, {
          onConflict: 'date,mission_name'
        });

      if (error) throw error;

      setMissions(missions.map(m => 
        m.id === id 
          ? { ...m, completed: newCompleted, streak: newCompleted ? m.streak + 1 : 0 }
          : m
      ));

      await updateMonthlyStats();

      toast({
        title: newCompleted ? "Mission Completed!" : "Mission Unmarked",
        description: `${mission.title} ${newCompleted ? 'completed' : 'unmarked'} for ${format(selectedDate, 'MMM dd, yyyy')}`,
      });
    } catch (error) {
      console.error('Error updating mission:', error);
      toast({
        title: "Error",
        description: "Failed to update mission. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateMonthlyStats = async () => {
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      
      // Calculate monthly stats
      const { data: monthlyData, error } = await supabase
        .from('missions')
        .select('completed')
        .gte('date', `${year}-${month.toString().padStart(2, '0')}-01`)
        .lt('date', `${year}-${(month + 1).toString().padStart(2, '0')}-01`);

      if (error) throw error;

      const totalMissionsThisMonth = monthlyData.length;
      const completedMissionsThisMonth = monthlyData.filter(m => m.completed).length;
      const completionRate = totalMissionsThisMonth > 0 ? (completedMissionsThisMonth / totalMissionsThisMonth * 100) : 0;

      await supabase
        .from('monthly_analytics')
        .upsert({
          month,
          year,
          total_missions: totalMissionsThisMonth,
          completed_missions: completedMissionsThisMonth,
          completion_rate: completionRate
        }, {
          onConflict: 'month,year'
        });

      setMonthlyStats({
        total: totalMissionsThisMonth,
        completed: completedMissionsThisMonth,
        rate: completionRate
      });
    } catch (error) {
      console.error('Error updating monthly stats:', error);
    }
  };

  const generateShareLink = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const encrypted = btoa(dateStr); // Simple base64 encoding for demo
    const shareUrl = `${window.location.origin}/progress/${encrypted}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share Link Copied!",
      description: "Public progress link copied to clipboard",
    });
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
        
        {/* Header Section with Admin Controls */}
        <div className="text-center space-y-4 slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(selectedDate, 'MMM dd, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Button onClick={generateShareLink} variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Copy Share Link
              </Button>
            </div>
            
            <Button onClick={onLogout} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Daily Mission Admin
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage daily habits and track progress
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">By</span>
            <Badge variant="outline" className="border-primary text-primary">
              Xplore With Tharvesh
            </Badge>
          </div>
        </div>

        {/* Progress Overview with Monthly Stats */}
        <Card className="p-6 slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center">
                <div className={`text-2xl font-bold ${getProgressColor()}`}>
                  {calculateProgress()}%
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Stats
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Total: {monthlyStats.total} missions
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed: {monthlyStats.completed}
                </div>
                <div className={`text-lg font-bold ${monthlyStats.rate >= 80 ? 'text-green-400' : monthlyStats.rate >= 60 ? 'text-yellow-400' : 'text-blue-400'}`}>
                  {monthlyStats.rate.toFixed(1)}% rate
                </div>
              </div>
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

export default DailyMissionTracker;
