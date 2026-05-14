// Mock DB inside the Server Component logic
const db = {
  notes: {
    getAll: async () => {
      return [
        { id: 1, content: 'Remember to buy milk (from Server DB)' },
        { id: 2, content: 'Finish the Server-Driven UI project (from Server DB)' },
        { id: 3, content: 'Go for a run (from Server DB)' },
      ];
    }
  }
};


export async function Notes() {
  const notes = await db.notes.getAll();

  // This structure mimics what a Server-Driven UI payload describes:
  // Components (Expandable) and their children/props (the p tag)
  return notes.map(note => ({
    component: 'Expandable',
    key: note.id,
    props: {
      children: {
        component: 'p',
        props: {
          children: note.content,
          className: 'text-gray-800 font-medium'
        }
      }
    }
  }));
}
