import React, { useState } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  'https://ixobpfakfxjnrntaqzmd.supabase.co',
  'sb_publishable_6EexxJWgAoZa7Ikg9c8aYg_urZR-6Jg'
);

const MASTER_PASSWORD = 'магия';

function App() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('entry');
  const [waitingList, setWaitingList] = useState([]);

  const enterCave = async () => {
    if (name.toLowerCase() === MASTER_PASSWORD) {
      setStatus('admin');
      fetchWaitingList();
      return;
    }
    const { error } = await supabase.from('sessions').insert([{ child_name: name, status: 'waiting' }]);
    if (!error) setStatus('waiting');
  };

  const fetchWaitingList = async () => {
    const { data } = await supabase.from('sessions').select('*').eq('status', 'waiting');
    setWaitingList(data || []);
  };

  const acceptChild = async (id) => {
    await supabase.from('sessions').update({ status: 'accepted' }).eq('id', id);
    fetchWaitingList();
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', color: 'white', background: '#1a1a2e', minHeight: '100vh', fontFamily: 'Arial' }}>
      {status === 'entry' && (
        <div>
          <h1>Магический Путь</h1>
          <input 
            style={{ padding: '15px', borderRadius: '10px', width: '80%', fontSize: '18px', color: 'black' }}
            placeholder="Имя юного героя" 
            onChange={(e) => setName(e.target.value)} 
          />
          <br /><br />
          <button onClick={enterCave} style={{ padding: '15px 30px', borderRadius: '10px', background: '#4ecca3', color: 'white', border: 'none', fontSize: '18px' }}>
            Зажечь фонарик
          </button>
        </div>
      )}
      {status === 'waiting' && <div><h2>Твой свет виден!</h2><p>Мастер скоро откроет проход...</p></div>}
      {status === 'admin' && (
        <div>
          <h2>Кабинет Мастера</h2>
          {waitingList.map(child => (
            <div key={child.id} style={{ background: '#16213e', margin: '10px', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{child.child_name}</span>
              <button onClick={() => acceptChild(child.id)} style={{ background: '#e94560', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>Впустить</button>
            </div>
          ))}
          <button onClick={fetchWaitingList} style={{ marginTop: '20px', color: 'gray' }}>Обновить список</button>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
            
