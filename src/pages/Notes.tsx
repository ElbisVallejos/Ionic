import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel,
  IonItemSliding, IonItemOptions, IonItemOption,
  IonIcon, IonFab, IonFabButton, IonText, IonNote
} from '@ionic/react';
import { add, trash } from 'ionicons/icons';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = React.useState<Note[]>(() => {
    const saved = localStorage.getItem('mis_notas');
    return saved ? JSON.parse(saved) : [];
  });

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('mis_notas', JSON.stringify(updated));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Notas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {notes.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <IonText color="medium">
              <p>No tienes notas aún.</p>
              <p>Toca el botón + para crear una.</p>
            </IonText>
          </div>
        ) : (
          <IonList>
            {notes.map(note => (
              <IonItemSliding key={note.id}>
                <IonItem>
                  <IonLabel>
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                    <IonNote>{note.date}</IonNote>
                  </IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => deleteNote(note.id)}>
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/create">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Notes;