const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

// Подключаемся к вашей базе
const supabaseClient = window.supabase.createClient(
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
    const { error } = await supabaseClient
      .from('sessions')
      .insert([{ child_name: name, status: 'waiting' }]);
    if (!error) setStatus('waiting');
  };

  const fetchWaitingList = async () => {
    const { data } = await supabaseClient.from('sessions').select('*').eq('status', 'waiting');
    setWaitingList(data || []);
  };

  const acceptChild = async (id) => {
    await supabaseClient.from('sessions').update({ status: 'accepted' }).eq('id', id);
    fetchWaitingList();
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', color: 'white', background: '#1a1a2e', minHeight: '100vh', fontFamily: 'Arial' }}>
      {status === 'entry' && (
        <div>
          <h1>Магический Путь</h1>
          <input 
            style={{ padding: '15px', borderRadius: '10px', width: '80%', fontSize: '18px', color: 'black', border: 'none' }}
            placeholder="Имя героя" 
            onChange={(e) => setName(e.target.value)} 
          />
          <br /><br />
          <button onClick={enterCave} style={{ padding: '15px 30px', borderRadius: '10px', background: '#4ecca3', color: 'white', border: 'none', fontSize: '18px', cursor: 'pointer', marginTop: '20px' }}>
            Зажечь фонарик
          </button>
        </div>
      )}
      
      {status === 'waiting' && (
        <div>
          <h2>Твой свет виден!</h2>
          <p>Мастер скоро откроет проход...</p>
        </div>
      )}
      
      {status === 'admin' && (
        <div>
          <h2>Кабинет Мастера</h2>
          {waitingList.length === 0 ? <p>Пока никто не ждет входа...</p> : 
            waitingList.map(child => (
              <div key={child.id} style={{ background: '#16213e', margin: '10px auto', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '400px' }}>
                <span>{child.child_name}</span>
                <button onClick={() => acceptChild(child.id)} style={{ background: '#e94560', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Впустить</button>
              </div>
            ))
          }
          <button onClick={fetchWaitingList} style={{ marginTop: '30px', padding: '10px', background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '5px', cursor: 'pointer' }}>Обновить список</button>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
            
