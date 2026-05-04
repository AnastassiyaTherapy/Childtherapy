import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
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
    <div style={{ textAlign: 'center', padding: '50px', color: 'white', background: '#1a1a2e', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {status === 'entry' && (
        <div>
          <h1>Магический Путь</h1>
          <input 
            style={{ padding: '15px', borderRadius: '10px', width: '80%', fontSize: '18px', color: 'black', border: 'none' }}
            placeholder="Имя юного героя" 
            onChange={(e) => setName(e.target.value)} 
          />
          <br /><br />
          <button onClick={enterCave} style={{ padding: '15px 30px', borderRadius: '10px', background: '#4ecca3', color: 'white', border: 'none', fontSize: '18px', cursor: 'pointer' }}>
            Зажечь фонарик
          </button>
        </div>
      )}
      {status === 'waiting' && (
        <div>
          <h2>Твой свет виден!</h2>
          <p>Мастер уже знает, что ты здесь, и скоро откроет проход...</p>
        </div>
      )}
      {status === 'admin' && (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2>Кабинет Мастера</h2>
          {waitingList.length === 0 ? <p>Пока никто не ждет входа...</p> : 
            waitingList.map(child => (
              <div key={child.id} style={{ background: '#16213e', margin: '10px 0', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Герой: <b>{child.child_name}</b></span>
                <button onClick={() => acceptChild(child.id)} style={{ padding: '8px 15px', background: '#e94560', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Впустить
                </button>
              </div>
            ))
          }
          <button onClick={fetchWaitingList} style={{ marginTop: '20px', background: 'none', border: '1px solid white', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
            Обновить список
          </button>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);

