/**
 * Cấu hình không gian 3D Spline và ánh xạ tương tác
 * Centralized Configuration for Spline 3D Scene and Interactive Bindings
 */
import { PROJECTS_MAP, ProjectItem } from './portfolioData';

export type SectionType = 'home' | 'about' | 'projects' | 'contact';

export interface InteractiveObjectConfig {
  name: string;
  type: 'project' | 'section' | 'action';
  targetId?: string;
  targetSection?: SectionType;
  label: string;
  description: string;
}

export const SCENE_CONFIG = {
  // URL Scene Spline: Ưu tiên lấy từ biến môi trường VITE_SPLINE_SCENE_URL
  defaultSceneUrl:
    import.meta.env.VITE_SPLINE_SCENE_URL ||
    'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',

  // Ánh xạ trigger event chuyển đổi Camera theo từng Section
  cameraTriggers: {
    home: 'Camera_Home_Trigger',
    about: 'Camera_About_Trigger',
    projects: 'Camera_Projects_Trigger',
    contact: 'Camera_Contact_Trigger',
  } as Record<SectionType, string>,

  // Biến toàn cục khai báo trong Spline Scene để đồng bộ trạng thái
  splineVariables: {
    activeSection: 'activeSection',
    isDarkMode: 'isDarkMode',
    cursorParallaxX: 'mouseOffsetX',
    cursorParallaxY: 'mouseOffsetY',
  },

  // Danh sách các Object 3D tương tác được nhận diện qua Raycasting
  // Khớp với các dự án thực tế trong portfolioData.ts
  interactiveObjects: [
    {
      name: 'Monitor_Screen',
      type: 'project',
      targetId: 'alpr',
      label: 'ALPR Computer Vision Terminal',
      description: 'Hệ thống nhận diện biển số xe tự động YOLOv5 & OpenCV',
    },
    {
      name: 'Laptop_Mesh',
      type: 'project',
      targetId: 'eta-logistics',
      label: 'Smart Logistics ETA System',
      description: 'Mô hình dự đoán thời gian giao hàng tối ưu chuỗi cung ứng',
    },
    {
      name: 'Notebook_CV',
      type: 'section',
      targetSection: 'about',
      label: 'Developer Resume / CV',
      description: 'Hồ sơ năng lực kỹ thuật và thông tin học vấn UTH',
    },
    {
      name: 'Desk_Lamp',
      type: 'project',
      targetId: 'gold-prediction',
      label: 'Gold Price Prediction Platform',
      description: 'Nền tảng web dự báo biến động giá vàng thời gian thực',
    },
  ] as InteractiveObjectConfig[],
};

// Re-export danh sách dự án cho tương thích ngược
export const SAMPLE_PROJECTS: Record<string, ProjectItem> = PROJECTS_MAP;
export type { ProjectItem };
