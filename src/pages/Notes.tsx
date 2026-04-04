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
  const [notes, setNotes]           = useState<Note[]>([]);
  const [search, setSearch]         = useState('');
  const [activeTag, setActiveTag]   = useState('Todas');
  const [allTags, setAllTags]       = useState<string[]>([]);
  const [actionNote, setActionNote] = useState<Note | null>(null);
  const router = useIonRouter();

  useIonViewWillEnter(() => {
  const saved: Note[] = JSON.parse(localStorage.getItem('mis_notas') || '[]');
  setNotes(saved);
  setAllTags(Array.from(new Set(saved.flatMap(n => n.tags || []))));
  setActiveTag('Todas');
});

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('mis_notas', JSON.stringify(updated));
    setAllTags(Array.from(new Set(updated.flatMap(n => n.tags || []))));
  };

  // 2. Filtrado por tag activo + búsqueda
  const filtered = notes.filter(n => {
  const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
  const matchTag = activeTag === 'Todas' || (n.tags ?? []).includes(activeTag);
  return matchSearch && matchTag;
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notas ME</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#cc0000' }}>Mis Notas</h1>
        <p style={{ color: '#888', fontSize: 13, marginTop: -12, marginBottom: 12 }}> {filtered.length} nota{filtered.length !== 1 ? 's' : ''}
      </p>

        <IonSearchbar
          value={search}
          onIonInput={e => setSearch(e.detail.value!)}
          placeholder="Buscar..."
          style={{ '--border-radius': '12px' }}
        />

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
          {['Todas', ...allTags].map(tag => {
            const isActive = activeTag === tag;
            return (
              <IonChip
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  // 1. Estilo tag activo: fondo rojo pastel, texto rojo
                  backgroundColor: isActive ? '#ffe5e5' : '#f0f0f0',
                  color:           isActive ? '#cc0000' : '#555',
                  border:          isActive ? '1px solid #ffb3b3' : '1px solid transparent',
                  fontWeight:      isActive ? 600 : 400,
                  borderRadius:    '20px',
                  whiteSpace:      'nowrap',
                  transition:      'all 0.2s ease',
                }}
              >
                {tag}
              </IonChip>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <IonText color="medium">
              <p>No hay notas{activeTag !== 'Todas' ? ` con la etiqueta "${activeTag}"` : ''}.</p>
              <p>Toca el botón + para crear una.</p>
            </IonText>
          </div>
        ) : (
          <IonList style={{ background: 'transparent', padding: 0 }}>
            {filtered.map(note => (
              <IonItemSliding key={note.id}>

                {/* 3. Tarjetas redondeadas con sombra */}
                <IonItem
                  lines="none"
                  style={{
                    '--background':      '#ffffff',
                    '--border-radius':   '16px',
                    '--inner-padding-end': '8px',
                    marginBottom:        '10px',
                    borderRadius:        '16px',
                    boxShadow:           '0 2px 8px rgba(0,0,0,0.07)',
                    overflow:            'hidden',
                  }}
                >
                  <IonLabel>
                    <h2 style={{ fontWeight: 600, marginBottom: 4, color: '#cc0000' }}>{note.title}</h2>
                    <p style={{ 
                    color: '#888', 
                    fontSize: 13,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {note.content}
                  </p>
                    <IonNote style={{ fontSize: 12 }}>{note.date}</IonNote>

                    {note.tags?.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                        {note.tags.map(t => (
                          <span
                            key={t}
                            style={{
                              background:   '#ffe5e5',
                              color:        '#cc0000',
                              fontSize:     11,
                              borderRadius: 8,
                              padding:      '2px 8px',
                              fontWeight:   500,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </IonLabel>

                  <IonIcon
                    icon={ellipsisVertical}
                    slot="end"
                    color="medium"
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

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/create">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

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