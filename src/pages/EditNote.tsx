import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonInput, IonTextarea, IonItem, IonLabel,
  IonButtons, IonBackButton, IonToast, IonChip, IonIcon,
  IonAlert
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { closeCircle, addOutline } from 'ionicons/icons';
import { Note } from '../types';

const EditNote: React.FC = () => {
  const { id }    = useParams<{ id: string }>();
  const history   = useHistory();
  const [title, setTitle]               = useState('');
  const [content, setContent]           = useState('');
  const [tags, setTags]                 = useState<string[]>([]);
  const [showTagAlert, setShowTagAlert] = useState(false);
  const [showToast, setShowToast]       = useState(false);

  useEffect(() => {
    const notes: Note[] = JSON.parse(localStorage.getItem('mis_notas') || '[]');
    const note = notes.find(n => n.id === id);
    if (note) { setTitle(note.title); setContent(note.content); setTags(note.tags || []); }
  }, [id]);

  const handleSave = () => {
    if (!title.trim()) { setShowToast(true); return; }
    const notes: Note[] = JSON.parse(localStorage.getItem('mis_notas') || '[]');
    const updated = notes.map(n => n.id === id ? { ...n, title, content, tags } : n);
    localStorage.setItem('mis_notas', JSON.stringify(updated));
    history.push('/notes');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/notes" /></IonButtons>
          <IonTitle>Editar Nota</IonTitle>
          <IonButtons slot="end">
            <IonButton strong onClick={handleSave}>Guardar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Título</IonLabel>
          <IonInput value={title} onIonChange={e => setTitle(e.detail.value!)} />
        </IonItem>

        <IonItem style={{ marginTop: '1rem' }}>
          <IonLabel position="stacked">Contenido</IonLabel>
          <IonTextarea value={content} onIonChange={e => setContent(e.detail.value!)} rows={8} />
        </IonItem>

        {/* Etiquetas */}
        <div style={{ marginTop: '1.5rem', paddingLeft: 16 }}>
          <IonLabel style={{ fontWeight: 600, fontSize: 14 }}>Etiquetas</IonLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {tags.map(tag => (
              <IonChip key={tag}>
                {tag}
                <IonIcon icon={closeCircle} onClick={() => setTags(tags.filter(t => t !== tag))} />
              </IonChip>
            ))}
            <IonChip outline onClick={() => setShowTagAlert(true)}>
              <IonIcon icon={addOutline} /> Añadir
            </IonChip>
          </div>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showTagAlert}
        onDidDismiss={() => setShowTagAlert(false)}
        header="Nueva etiqueta"
        inputs={[{ name: 'tag', type: 'text', placeholder: 'Ej: trabajo, ideas...' }]}
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Añadir',
            handler: (d) => {
              const t = d.tag?.trim();
              if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
            }
          }
        ]}
      />
      <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)}
        message="El título es obligatorio" duration={2000} color="danger" />
    </IonPage>
  );
};

export default EditNote;