import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { ProjectController, Project } from '@/components/storage/ProjectsController';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ProjectListViewProps {
  onSelectProject: (project: Project) => void; 
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({ 
  onSelectProject 
}) => {

  const [projects, setProjects] = useState<Project[]>([]);
  const { getAllProjects } = ProjectController();
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const ProjectItem = ({ project }: { project: Project }) => (
    <View className="flex-row items-center py-3 border-b border-slate-500" style={styles.task}>
        <View className='flex-1 w-full'>
            <TouchableOpacity onPress={() => {
                onSelectProject(project);
                }} className='flex-row items-center justify-between w-full'>
                <View className="flex-row justify-start gap-2">
                    <Image
                        source={require('@/assets/images/task_proj.png')} 
                        style={styles.pomodoroImage}
                    />
                    <Text className="text-white font-semibold" style={{ fontSize: 18 }}>
                        {project.name}
                    </Text>
                </View>
                <View>
                    
                        <Ionicons name="checkmark-outline" size={20} color={'lightgreen'} />
                </View>
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View className="w-full h-full">
      <ScrollView className="flex-1"
            contentContainerStyle={{
                  paddingBottom: Dimensions.get('window').height - 500,}}>
        <View className="flex-1">
          <View className="flex-1 w-full">
          <View className="flex-row items-center py-3 bg-slate-500 rounded-lg" style={styles.task}>

            <View className='flex-1 w-full'>
                    <TouchableOpacity onPress={() => {
                        // onSelectProject(project);
                        }} className='flex-row items-center justify-between w-full'>
                        <View className="flex-row justify-start gap-2">
                            <Image
                                source={require('@/assets/images/task_proj.png')} 
                                style={styles.pomodoroImage}
                            />
                            <Text className="text-white font-semibold" style={{ fontSize: 18 }}>
                                Tasks
                            </Text>
                        </View>
                        <View>
                        
                                <Ionicons name="checkmark-outline" size={20} color={'lightgreen'} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {projects.length === 0 ? (
                <TouchableOpacity className='w-full bg-yellow-200 py-4 px-8 rounded-xl'>
                    <Text className="text-gray-200 text-center text-lg">+ Add Project</Text>
                </TouchableOpacity>
            ) : (
              projects.map(project => (
                <ProjectItem key={project.id} project={project} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  task: {
    padding: 10,
    marginBottom: 10,
    borderBottomColor: '#4B5563',
    borderBottomWidth: 1,
  },
  pomodoroImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});