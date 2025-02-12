import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { CodeRoom } from '../components/CodeRoom';
import { database } from '../services/firebase';
import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth'
import { useRoom} from '../hooks/useRoom'

import { QuestionsBox } from '../components/Questions/Questions';
import '../styles/room.scss'
type RoomData = {
    id: string,
}

export function Room(roomData: RoomData) {
    const params = useParams<RoomData>();
    const { userData } = useAuth();
    const {title, questions } = useRoom(params.id);

    const [newQuestion, setNewQuestion] = useState('');

    const question = {
        content: newQuestion,
        author: {
            name: userData?.name,
            avatar: userData?.avatar,
        },
        isHighlighted: false,
        isAnswered: false,
    }

    async function setFirebase(event: FormEvent) {
        event.preventDefault();
        if (newQuestion.trim() === "") {
            return;
        }
        const usersRef = await database.ref('rooms');
        usersRef.child(`${params.id}/questions`).push(question);
    }
    return(
        <div id="page-room">
            <header>
                <div className="class-header">
                    <img src={logoImg} alt="LetMeAsk" />
                    <CodeRoom code={params.id} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={setFirebase}>
                    <textarea
                        placeholder="O que voce quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        {!userData ? (
                            <span> Para enviar uma pergunta, <button>registre-se</button> </span>) : 
                        (   <div className="user-info">
                                <img src={userData.avatar} />
                                <span>{userData.name}</span>
                            </div>
                        )}
                        <Button type="submit" disabled={!userData}> Enviar uma pergunta</Button>
                    </div>
                    {questions.map(item => {
                        return (
                            <QuestionsBox key={item.id} content={item.content} author={item.author}>
                                <button className="like-button"
                                    type="button"
                                    aria-label="Marcar como gostei"
                                >
                                    <span>10</span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                            </QuestionsBox>
                            );
                        })
                    }
                </form>
            </main>
        </div>
    );
}