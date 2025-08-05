
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  Timer, 
  Dumbbell,
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  rest: number; // rest time in seconds
}

export const WorkoutTimer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTime, setRestTime] = useState(60); // default 60 seconds rest
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);

  // Mock workout data
  const workout: Exercise[] = [
    { id: '1', name: 'Agachamento', sets: 4, reps: '8-12', weight: '60kg', rest: 90 },
    { id: '2', name: 'Supino', sets: 4, reps: '8-10', weight: '50kg', rest: 90 },
    { id: '3', name: 'Remada', sets: 4, reps: '10-12', weight: '45kg', rest: 90 },
    { id: '4', name: 'Desenvolvimento', sets: 3, reps: '8-10', weight: '30kg', rest: 90 }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
        if (!isResting) {
          setWorkoutTime(prev => prev + 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isResting]);

  useEffect(() => {
    if (isResting && restTime > 0) {
      const restInterval = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            setIsResting(false);
            setRestTime(workout[currentExercise]?.rest || 60);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(restInterval);
    }
  }, [isResting, restTime, currentExercise, workout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTime(0);
    setWorkoutTime(0);
    setCurrentExercise(0);
    setCurrentSet(1);
    setIsResting(false);
    setRestTime(workout[0]?.rest || 60);
  };

  const nextSet = () => {
    const currentWorkout = workout[currentExercise];
    if (currentSet < currentWorkout.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTime(currentWorkout.rest);
    } else {
      nextExercise();
    }
  };

  const nextExercise = () => {
    if (currentExercise < workout.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setRestTime(workout[currentExercise + 1]?.rest || 60);
    }
  };

  const adjustRestTime = (seconds: number) => {
    setRestTime(prev => Math.max(0, prev + seconds));
  };

  const currentWorkout = workout[currentExercise];

  return (
    <div className="space-y-6">
      {/* Main Timer Display */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-2xl">
            <Timer className="h-6 w-6 mr-2" />
            Cronômetro de Treino
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl font-mono font-bold text-blue-600">
            {formatTime(time)}
          </div>
          <div className="text-lg text-muted-foreground">
            Tempo de treino: <span className="font-semibold">{formatTime(workoutTime)}</span>
          </div>
          
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button onClick={startTimer} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Iniciar
              </Button>
            ) : (
              <Button onClick={pauseTimer} variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </Button>
            )}
            <Button onClick={stopTimer} variant="destructive">
              <Square className="h-4 w-4 mr-2" />
              Parar
            </Button>
            <Button onClick={() => setTime(0)} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Exercise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dumbbell className="h-5 w-5 mr-2" />
            Exercício Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{currentWorkout?.name}</h3>
              <Badge variant="outline">
                {currentExercise + 1} / {workout.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Série</p>
                <p className="text-lg font-semibold">{currentSet} / {currentWorkout?.sets}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Repetições</p>
                <p className="text-lg font-semibold">{currentWorkout?.reps}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peso</p>
                <p className="text-lg font-semibold">{currentWorkout?.weight || 'Peso corporal'}</p>
              </div>
            </div>

            <Button onClick={nextSet} className="w-full">
              {currentSet < currentWorkout?.sets ? 'Próxima Série' : 'Próximo Exercício'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rest Timer */}
      {isResting && (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700">Descanso</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-mono font-bold text-orange-600">
              {formatTime(restTime)}
            </div>
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustRestTime(-10)}
              >
                <Minus className="h-4 w-4" />
                10s
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustRestTime(10)}
              >
                <Plus className="h-4 w-4" />
                10s
              </Button>
              <Button
                onClick={() => {
                  setIsResting(false);
                  setRestTime(currentWorkout?.rest || 60);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Pular Descanso
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workout Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso do Treino</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workout.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`p-3 rounded-lg border ${
                  index === currentExercise
                    ? 'bg-blue-50 border-blue-200'
                    : index < currentExercise
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} séries × {exercise.reps}
                      {exercise.weight && ` - ${exercise.weight}`}
                    </p>
                  </div>
                  <Badge
                    variant={
                      index === currentExercise
                        ? 'default'
                        : index < currentExercise
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {index === currentExercise
                      ? `${currentSet}/${exercise.sets}`
                      : index < currentExercise
                      ? 'Concluído'
                      : 'Aguardando'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
