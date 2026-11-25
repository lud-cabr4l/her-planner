
import { useState } from 'react'
import './App.css'
import {
  House, CheckSquare, Target, Heart, CalendarDays,
  LogOut, Plus, Trash2, Check, Clock, Pencil
} from 'lucide-react'

function App() {
  const [usuarioSalvo] = useState(
  JSON.parse(localStorage.getItem("herPlannerSessao")) || null
);

const [tela, setTela] = useState(usuarioSalvo ? "inicio" : "login");
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [usuario, setUsuario] = useState(
  JSON.parse(localStorage.getItem("herPlannerSessao"))?.nome || ""
);
  const [emailAtivo, setEmailAtivo] = useState('')

  const [cadastros, setCadastros] = useState(() =>
    JSON.parse(localStorage.getItem('herPlannerUsuarios') || '[]')
  )

  const [tarefas, setTarefas] = useState([])
  const [novaTarefa, setNovaTarefa] = useState('')

  const [metas, setMetas] = useState([])
  const [novaMeta, setNovaMeta] = useState('')

  function carregarDados(emailUsuario) {
    setTarefas(JSON.parse(
      localStorage.getItem(`herPlannerTarefas_${emailUsuario}`) || '[]'
    ))
    setMetas(JSON.parse(
      localStorage.getItem(`herPlannerMetas_${emailUsuario}`) || '[]'
    ))
  }

  function entrar(event) {
    event.preventDefault()

    const encontrado = cadastros.find(
      item =>
        item.email === email.trim().toLowerCase() &&
        item.senha === senha
    )

    if (!encontrado) {
      alert('E-mail ou senha incorretos. Verifique seus dados ou cadastre-se.')
      return
    }

    setUsuario(encontrado.nome)
    setEmailAtivo(encontrado.email)
    localStorage.setItem("herPlannerSessao", JSON.stringify(encontrado));
    carregarDados(encontrado.email)
    setTela('dashboard')
  }

  function cadastrar(event) {
    event.preventDefault()

    const nomeCorreto = nome.trim()
    const emailCorreto = email.trim().toLowerCase()

    if (!nomeCorreto || !emailCorreto || !senha) {
      alert('Preencha todos os campos.')
      return
    }

    if (cadastros.some(item => item.email === emailCorreto)) {
      alert('Este e-mail já está cadastrado. Faça login.')
      return
    }

    const novoUsuario = {
      nome: nomeCorreto,
      email: emailCorreto,
      senha
    }

    const atualizados = [...cadastros, novoUsuario]

    setCadastros(atualizados)
    localStorage.setItem('herPlannerUsuarios', JSON.stringify(atualizados))

    setUsuario(nomeCorreto)
    setEmailAtivo(emailCorreto)
    setTarefas([])
    setMetas([])
    setTela('dashboard')
  }

  function sair() {
    localStorage.removeItem("herPlannerSessao");

    setTela('login')
    setNome('')
    setEmail('')
    setSenha('')
    setUsuario('')
    setEmailAtivo('')
    setTarefas([])
    setMetas([])
  }

  function salvarTarefas(lista) {
    setTarefas(lista)
    localStorage.setItem(
      `herPlannerTarefas_${emailAtivo}`,
      JSON.stringify(lista)
    )
  }

  function adicionarTarefa(event) {
    event.preventDefault()
    if (!novaTarefa.trim()) return

    const nova = {
      id: Date.now(),
      texto: novaTarefa.trim(),
      concluida: false
    }

    salvarTarefas([...tarefas, nova])
    setNovaTarefa('')
  }

  function concluirTarefa(id) {
    const atualizadas = tarefas.map(tarefa =>
      tarefa.id === id
        ? { ...tarefa, concluida: !tarefa.concluida }
        : tarefa
    )
    salvarTarefas(atualizadas)
  }

  function excluirTarefa(id) {
    salvarTarefas(tarefas.filter(tarefa => tarefa.id !== id))
  }

  function editarTarefa(id) {
    const tarefa = tarefas.find(item => item.id === id)
    const texto = prompt('Edite sua tarefa:', tarefa.texto)

    if (texto && texto.trim()) {
      salvarTarefas(tarefas.map(item =>
        item.id === id
          ? { ...item, texto: texto.trim() }
          : item
      ))
    }
  }

  function salvarMetas(lista) {
    setMetas(lista)
    localStorage.setItem(
      `herPlannerMetas_${emailAtivo}`,
      JSON.stringify(lista)
    )
  }

  function adicionarMeta(event) {
    event.preventDefault()
    if (!novaMeta.trim()) return

    const nova = {
      id: Date.now(),
      texto: novaMeta.trim(),
      progresso: 0
    }

    salvarMetas([...metas, nova])
    setNovaMeta('')
  }

  function atualizarProgresso(id, valor) {
    salvarMetas(metas.map(meta =>
      meta.id === id
        ? { ...meta, progresso: Number(valor) }
        : meta
    ))
  }

  function excluirMeta(id) {
    salvarMetas(metas.filter(meta => meta.id !== id))
  }

  function editarMeta(id) {
    const meta = metas.find(item => item.id === id)
    const texto = prompt('Digite o novo nome da meta:', meta.texto)

    if (texto && texto.trim()) {
      salvarMetas(metas.map(item =>
        item.id === id
          ? { ...item, texto: texto.trim() }
          : item
      ))
    }
  }

  const menu = [
    { nome: 'Início', tela: 'dashboard', Icone: House },
    { nome: 'Tarefas', tela: 'tarefas', Icone: CheckSquare },
    { nome: 'Metas', tela: 'metas', Icone: Target },
    { nome: 'Hábitos', tela: 'habitos', Icone: Heart },
    { nome: 'Calendário', tela: 'calendario', Icone: CalendarDays }
  ]

  const tarefasConcluidas = tarefas.filter(t => t.concluida).length

  return (
    <div className="app">

      {tela === 'login' || tela === 'cadastro' ? (

        <main className="login-container">
          <section className="login-info">
            <span className="logo">her planner.</span>
            <div>
              <h1>
                Organize sua rotina.
                <br />
                Floresça no seu tempo. ♡
              </h1>
              <p>
                Um espaço feito para você organizar seus planos,
                cuidar de si e conquistar seus objetivos.
              </p>
            </div>
            <span className="decoracao">♡</span>
          </section>

          <section className="login-form">
            <span className="logo mobile-logo">her planner.</span>

            <h2>
              {tela === 'login' ? 'Bem-vinda de volta!' : 'Crie sua conta'}
            </h2>

            <p className="subtitulo">
              {tela === 'login'
                ? 'Entre no seu espaço de organização.'
                : 'Comece a organizar sua vida com a gente.'}
            </p>

            <form onSubmit={tela === 'login' ? entrar : cadastrar}>
              {tela === 'cadastro' && (
                <label>
                  Seu nome
                  <input
                    type="text"
                    placeholder="Ex.: Ludmila Cabral"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                  />
                </label>
              )}

              <label>
                E-mail
                <input
                  type="email"
                  placeholder="seuemail@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Senha
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
              </label>

              <button type="submit" className="botao-principal">
                {tela === 'login'
                  ? 'Entrar na minha conta'
                  : 'Criar minha conta'}
              </button>
            </form>

            <p className="alternativa">
              {tela === 'login'
                ? 'Ainda não tem uma conta?'
                : 'Já possui uma conta?'}

              <button
                className="botao-link"
                onClick={() => {
                  setTela(tela === 'login' ? 'cadastro' : 'login')
                  setNome('')
                  setEmail('')
                  setSenha('')
                }}
              >
                {tela === 'login' ? 'Cadastre-se' : 'Fazer login'}
              </button>
            </p>
          </section>
        </main>

      ) : (

        <main className="dashboard">
          <aside className="sidebar">
            <span className="logo">her planner.</span>
            <p>MENU PRINCIPAL</p>

            {menu.map(({ nome, tela: destino, Icone }) => (
              <button
                key={destino}
                className="menu-item"
                onClick={() => setTela(destino)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: tela === destino ? '#ecd5dc' : 'transparent'
                }}
              >
                <Icone size={18} />
                {nome}
              </button>
            ))}

            <button className="sair" onClick={sair}>
              <LogOut size={18} /> Sair da conta
            </button>
          </aside>

          <section className="conteudo">
            <span className="logo mobile-logo">her planner.</span>

            {tela === 'dashboard' && (
              <>
                <p className="saudacao">SEU ESPAÇO PESSOAL</p>
                <h1>Olá, {usuario}! ♡</h1>
                <p>Que bom ter você por aqui. Vamos organizar seu dia?</p>

                <div className="cards">
                  <article className="card">
                    <CheckSquare size={28} />
                    <h2>Suas tarefas</h2>
                    <p>{tarefas.length} tarefa(s) cadastrada(s).</p>
                  </article>

                  <article className="card">
                    <Target size={28} />
                    <h2>Suas metas</h2>
                    <p>{metas.length} meta(s) cadastrada(s).</p>
                  </article>

                  <article className="card">
                    <Heart size={28} />
                    <h2>Seus hábitos</h2>
                    <p>Cuide de você um dia de cada vez.</p>
                  </article>
                </div>

                <div className="boas-vindas">
                  <h2>Um lembrete para você ♡</h2>
                  <p>
                    Não precisa fazer tudo hoje.
                    Um pequeno passo também é progresso.
                  </p>
                </div>
              </>
            )}

            {tela === 'tarefas' && (
              <>
                <p className="saudacao">SUA ORGANIZAÇÃO</p>
                <h1>Minhas tarefas ♡</h1>
                <p>Organize suas atividades e acompanhe seu progresso.</p>

                <div className="boas-vindas">
                  <h2>Adicionar nova tarefa</h2>
                  <form
                    onSubmit={adicionarTarefa}
                    style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}
                  >
                    <input
                      value={novaTarefa}
                      onChange={e => setNovaTarefa(e.target.value)}
                      placeholder="Digite uma tarefa..."
                      required
                      style={{ flex: 1, minWidth: '180px', padding: '14px', border: '1px solid #eadde0', borderRadius: '10px' }}
                    />
                    <button className="botao-principal">
                      <Plus size={18} /> Adicionar
                    </button>
                  </form>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <h2>Minha lista</h2>
                  <p style={{ margin: '10px 0 20px' }}>
                    {tarefasConcluidas} de {tarefas.length} tarefas concluídas
                  </p>

                  {tarefas.length === 0 ? (
                    <div className="card">
                      <Clock size={28} />
                      <h2>Nenhuma tarefa por enquanto</h2>
                      <p>Adicione sua primeira tarefa!</p>
                    </div>
                  ) : tarefas.map(tarefa => (
                    <div
                      className="card"
                      key={tarefa.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}
                    >
                      <button
                        onClick={() => concluirTarefa(tarefa.id)}
                        style={{
                          border: '1px solid #d9b9c3',
                          borderRadius: '50%',
                          background: tarefa.concluida ? '#b77d8e' : 'white',
                          color: 'white',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer'
                        }}
                      >
                        {tarefa.concluida && <Check size={16} />}
                      </button>

                      <span style={{
                        flex: 1,
                        textDecoration: tarefa.concluida ? 'line-through' : 'none'
                      }}>
                        {tarefa.texto}
                      </span>

                      <button className="botao-link" onClick={() => editarTarefa(tarefa.id)}>
                        <Pencil size={17} />
                      </button>

                      <button className="botao-link" onClick={() => excluirTarefa(tarefa.id)}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tela === 'metas' && (
              <>
                <p className="saudacao">SEUS OBJETIVOS</p>
                <h1>Minhas metas ✧</h1>
                <p>Transforme seus sonhos em conquistas.</p>

                <div className="boas-vindas">
                  <h2>Adicionar nova meta</h2>
                  <form
                    onSubmit={adicionarMeta}
                    style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}
                  >
                    <input
                      value={novaMeta}
                      onChange={e => setNovaMeta(e.target.value)}
                      placeholder="Ex.: Ler 12 livros"
                      required
                      style={{ flex: 1, minWidth: '180px', padding: '14px', border: '1px solid #eadde0', borderRadius: '10px' }}
                    />
                    <button className="botao-principal">
                      <Plus size={18} /> Adicionar
                    </button>
                  </form>
                </div>

                <div style={{ marginTop: '30px' }}>
                  {metas.length === 0 ? (
                    <div className="card">
                      <Target size={28} />
                      <h2>Nenhuma meta cadastrada</h2>
                      <p>Adicione seu primeiro objetivo!</p>
                    </div>
                  ) : metas.map(meta => (
                    <div className="card" key={meta.id} style={{ marginBottom: '15px' }}>
                      <h2>{meta.texto}</h2>
                      <p>{meta.progresso}% concluído</p>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={meta.progresso}
                        onChange={e => atualizarProgresso(meta.id, e.target.value)}
                        style={{ width: '100%', margin: '15px 0' }}
                      />

                      <button className="botao-link" onClick={() => editarMeta(meta.id)}>
                        <Pencil size={17} /> Editar
                      </button>

                      <button className="botao-link" onClick={() => excluirMeta(meta.id)}>
                        <Trash2 size={17} /> Excluir
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tela === 'habitos' && (
              <>
                <p className="saudacao">SEU AUTOCUIDADO</p>
                <h1>Meus hábitos ♡</h1>
                <div className="boas-vindas">
                  <h2>Cuide de você todos os dias.</h2>
                  <p>Em breve, você poderá cadastrar e acompanhar seus hábitos diários.</p>
                </div>
              </>
            )}

            {tela === 'calendario' && (
              <>
                <p className="saudacao">SUA PROGRAMAÇÃO</p>
                <h1>Meu calendário</h1>
                <div className="boas-vindas">
                  <h2>Se organize com tranquilidade.</h2>
                  <p>Em breve, você poderá organizar seus compromissos e datas importantes.</p>
                </div>
              </>
            )}
          </section>
        </main>
      )}
    </div>
  )
}

export default App
