import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton, IonInput, IonTextarea,
  IonItem, IonLabel, IonButtons, IonBackButton,
  IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const CreateNote: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const handleSave = () => {
    if (!title.trim()) {
      setShowToast(true);
      return;
    }
    const notes = JSON.parse(localStorage.getItem('mis_notas') || '[]');
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toLocaleDateString('es-PA')
    };
    localStorage.setItem('mis_notas', JSON.stringify([newNote, ...notes]));
    history.push('/notes');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/notes" />
          </IonButtons>
          <IonTitle>Nueva Nota</IonTitle>
          <IonButtons slot="end">
            <IonButton strong onClick={handleSave}>
              Guardar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Título</IonLabel>
          <IonInput
            value={title}
            onIonChange={e => setTitle(e.detail.value!)}
            placeholder="Escribe el título..."
          />
        </IonItem>

        <IonItem style={{ marginTop: '1rem' }}>
          <IonLabel position="floating">Contenido</IonLabel>
          <IonTextarea
            value={content}
            onIonChange={e => setContent(e.detail.value!)}
            placeholder="Escribe tu nota..."
            rows={8}
          />
        </IonItem>
      </IonContent>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="El título es obligatorio"
        duration={2000}
        color="danger"
      />
    </IonPage>
  );
};

export default CreateNote;