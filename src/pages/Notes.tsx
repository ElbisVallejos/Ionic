import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel,
  IonItemSliding, IonItemOptions, IonItemOption,
  IonIcon, IonFab, IonFabButton, IonText, IonNote,
  IonChip, IonSearchbar, IonActionSheet,
  useIonViewWillEnter, useIonRouter
} from '@ionic/react';
import { add, trash, pencil, ellipsisVertical, addOutline } from 'ionicons/icons';
import { Note } from '../types';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch]         = useState('');
  const [activeTag, setActiveTag]   = useState('Todas');
  const [allTags, setAllTags]       = useState<string[]>([]);
  const [actionNote, setActionNote] = useState<Note | null>(null);
  const router = useIonRouter(); // Para navegar programáticamente
  
  useIonViewWillEnter(() => {
     const saved: Note[] = JSON.parse(localStorage.getItem('mis_notas') || '[]');
    setNotes(saved);
    setAllTags(Array.from(new Set(saved.flatMap(n => n.tags || []))));
  });

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('mis_notas', JSON.stringify(updated));
    setAllTags(Array.from(new Set(updated.flatMap(n => n.tags || []))));
  };

  const filtered = notes.filter(n => {
  const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
  const matchTag    = activeTag === 'Todas' || n.tags.includes(activeTag);
  return matchSearch && matchTag;
  });

    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Notas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* Buscador */}
        <IonSearchbar
          value={search}
          onIonInput={e => setSearch(e.detail.value!)}
          placeholder="Buscar..."
        />

        {/* Filtro de tags */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
          {['Todas', ...allTags].map(tag => (
            <IonChip
              key={tag}
              color={activeTag === tag ? 'primary' : undefined}
              onClick={() => setActiveTag(tag)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tag}
            </IonChip>
          ))}
        </div>

        {/* Lista */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <IonText color="medium">
              <p>No hay notas{activeTag !== 'Todas' ? ` con la etiqueta "${activeTag}"` : ''}.</p>
              <p>Toca el botón + para crear una.</p>
            </IonText>
          </div>
        ) : (
          <IonList>
            {filtered.map(note => (
              <IonItemSliding key={note.id}>
                <IonItem lines="full" style={{ '--background': '#ffffff', marginBottom: '8px' }}>
                  <IonLabel>
                    <h2 style={{ fontWeight: '600' }}>{note.title}</h2>
                    <p style={{ color: '#666' }}>{note.content}</p>
                    <IonNote style={{ fontSize: '12px' }}>{note.date}</IonNote>
                    {/* Tags de la nota */}
                    {note.tags?.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                        {note.tags.map(t => (
                          <IonChip key={t} style={{ fontSize: 11, height: 20, margin: 0 }}>
                            {t}
                          </IonChip>
                        ))}
                      </div>
                    )}
                  </IonLabel>
                  <IonIcon
                    icon={ellipsisVertical}
                    slot="end"
                    onClick={() => setActionNote(note)}
                    style={{ cursor: 'pointer' }}
                  />
                </IonItem>

                <IonItemOptions side="end">
                  <IonItemOption color="primary" onClick={() => router.push(`/edit/${note.id}`)}>
                    <IonIcon slot="icon-only" icon={pencil} />
                  </IonItemOption>
                  <IonItemOption color="danger" onClick={() => deleteNote(note.id)}>
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        )}

        {/* FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/create">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Action sheet menú ⋮ */}
        <IonActionSheet
          isOpen={!!actionNote}
          onDidDismiss={() => setActionNote(null)}
          buttons={[
            {
              text: 'Editar',
              icon: pencil,
              handler: () => { if (actionNote) router.push(`/edit/${actionNote.id}`); }
            },
            {
              text: 'Eliminar',
              icon: trash,
              role: 'destructive',
              handler: () => { if (actionNote) deleteNote(actionNote.id); }
            },
            { text: 'Cancelar', role: 'cancel' }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Notes;