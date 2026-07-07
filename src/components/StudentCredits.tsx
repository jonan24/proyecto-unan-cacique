import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, Github, GraduationCap, Award, Users, Edit3, Trash2, Plus } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import EditModal, { FieldConfig } from "./EditModal";
import { StudentMember } from "../config/mediaConfig";

export default function StudentCredits() {
  const { isEditMode, students, updateStudent, addStudent, deleteStudent } = useAppData();
  
  // State for tracking the student being edited
  const [editingStudent, setEditingStudent] = useState<StudentMember | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const studentFields: FieldConfig[] = [
    { name: "name", label: "Nombre Completo", type: "text", placeholder: "Ej. Jonathan Espinoza" },
    { name: "role", label: "Rol / Especialidad Académica", type: "text", placeholder: "Ej. Desarrollador Full-Stack" },
    { name: "bio", label: "Biografía Académica", type: "textarea", placeholder: "Breve descripción sobre el aporte al proyecto" },
    { name: "email", label: "Correo Electrónico", type: "text", placeholder: "Ej. correo@ejemplo.com" },
    { name: "phone", label: "Teléfono de Contacto", type: "text", placeholder: "Ej. +505 8888-8888" },
    { name: "github", label: "Enlace de GitHub (Opcional)", type: "text", placeholder: "Ej. https://github.com/usuario" },
    { name: "url", label: "Fotografía de Perfil", type: "image" }
  ];

  const handleEditClick = (student: StudentMember) => {
    setEditingStudent(student);
  };

  const handleSaveStudent = (values: Record<string, any>) => {
    if (isAdding) {
      const newStudent: StudentMember = {
        id: `student-${Date.now()}`,
        name: values.name || "Nuevo Integrante",
        role: values.role || "Estudiante Colaborador",
        bio: values.bio || "Integrante de investigación histórica.",
        email: values.email || "correo@ejemplo.com",
        phone: values.phone || "",
        github: values.github || "",
        url: values.url || "/assets/images/student_placeholder_1783401881695.jpg"
      };
      addStudent(newStudent);
      setIsAdding(false);
    } else if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...editingStudent,
        ...values
      } as StudentMember);
      setEditingStudent(null);
    }
  };

  const handleDeleteClick = (id: string | number, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas quitar a "${name}" de los créditos académicos?`)) {
      deleteStudent(id);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  return (
    <div className="space-y-12">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 bg-colonial-cream text-colonial-terracotta border border-colonial-terracotta/20 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest">
          <Users className="w-3.5 h-3.5" />
          <span>Créditos Académicos</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-colonial-dark">
          Grupo de Estudiantes Creadores
        </h2>
        <p className="text-sm sm:text-base text-colonial-dark/70 font-sans leading-relaxed">
          Esta plataforma multimedia e interactiva ha sido diseñada y desarrollada con dedicación, 
          mística de estudio y rigor histórico por estudiantes de la Escuela Preparatoria de la 
          Universidad Nacional Autónoma de Nicaragua (UNAN-Managua).
        </p>
        <div className="w-16 h-1 bg-colonial-terracotta mx-auto rounded" />
      </div>

      {/* Admin control bar inside component */}
      {isEditMode && (
        <div className="max-w-6xl mx-auto flex justify-center sm:justify-end">
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-colonial-terracotta hover:bg-colonial-terracotta-dark text-white rounded-xl text-xs font-display font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Integrante del Grupo</span>
          </button>
        </div>
      )}

      {/* Grid of Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {students.map((student: StudentMember, idx) => {
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl border border-colonial-sand overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
            >
              {/* Edit / Delete overlays when in edit mode */}
              {isEditMode && (
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-xl border border-colonial-sand/60 shadow-md">
                  <button
                    onClick={() => handleEditClick(student)}
                    className="p-1.5 text-colonial-terracotta hover:bg-colonial-cream rounded-md transition-colors cursor-pointer"
                    title="Editar datos de este estudiante"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-colonial-sand" />
                  <button
                    onClick={() => handleDeleteClick(student.id, student.name)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    title="Eliminar este integrante"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Header Picture Frame with Hover Effect */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-b from-colonial-cream to-white flex items-center justify-center p-4">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-colonial-sand shadow-inner group-hover:border-colonial-terracotta transition-colors duration-300 relative">
                  <img
                    // REFERENCIA DE RUTA: Ruta de la foto del estudiante (definida en /src/config/mediaConfig.ts)
                    src={student.url}
                    alt={student.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Decorative Overlays */}
                  <div className="absolute inset-0 bg-colonial-terracotta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Academic Icon badge */}
                <div className="absolute top-4 right-4 bg-colonial-dark text-colonial-gold-light p-2 rounded-lg border border-colonial-gold/30">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>

              {/* Bio and Credits details */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4 border-t border-colonial-sand/30">
                <div className="space-y-2 text-center md:text-left">
                  <div className="text-xs font-mono font-bold uppercase tracking-widest text-colonial-terracotta bg-colonial-cream/60 py-1 px-2.5 rounded-md inline-block">
                    {student.role}
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-colonial-dark leading-tight group-hover:text-colonial-terracotta transition-colors">
                    {student.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-colonial-dark/75 leading-relaxed font-sans whitespace-pre-line">
                    {student.bio}
                  </p>
                </div>

                {/* Interactive Contact Drawer */}
                <div className="pt-4 border-t border-colonial-sand/50 flex items-center justify-center md:justify-start gap-4">
                  <a
                    href={`mailto:${student.email}`}
                    className="p-2 rounded-xl bg-colonial-cream/50 text-colonial-dark hover:bg-colonial-terracotta hover:text-white transition-all cursor-pointer"
                    title={`Enviar correo a ${student.email}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>

                  {student.phone && (
                    <a
                      href={`tel:${student.phone}`}
                      className="p-2 rounded-xl bg-colonial-cream/50 text-colonial-dark hover:bg-colonial-terracotta hover:text-white transition-all cursor-pointer"
                      title={`Llamar a ${student.phone}`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}

                  {student.github && (
                    <a
                      href={student.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-colonial-cream/50 text-colonial-dark hover:bg-colonial-terracotta hover:text-white transition-all cursor-pointer"
                      title="Visitar perfil de GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* University Banner */}
      <div className="bg-colonial-dark text-colonial-beige rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto border border-colonial-gold/20 shadow-lg text-center space-y-3">
        <Award className="w-10 h-10 text-colonial-gold mx-auto" />
        <h4 className="font-display font-bold text-lg text-colonial-gold-light uppercase tracking-wider">
          UNAN-Managua • Escuela Preparatoria
        </h4>
        <p className="text-xs sm:text-sm text-colonial-sand/90 max-w-2xl mx-auto font-sans leading-relaxed">
          Proyecto integrador desarrollado en el marco de la preservación de la memoria histórica 
          y los valores de soberanía, cultura y resistencia de los pueblos originarios de Nicaragua.
        </p>
      </div>

      {/* Modals for Editing and Adding */}
      <EditModal
        isOpen={!!editingStudent || isAdding}
        onClose={() => {
          setEditingStudent(null);
          setIsAdding(false);
        }}
        title={isAdding ? "Agregar Nuevo Integrante" : `Editar Estudiante: ${editingStudent?.name}`}
        fields={studentFields}
        initialValues={
          isAdding
            ? { name: "", role: "", bio: "", email: "", phone: "", github: "", url: "" }
            : (editingStudent || {})
        }
        onSave={handleSaveStudent}
      />
    </div>
  );
}
