import {ReactNode} from 'react';
import './styles.scss'

type QuestionsProps = {
    content: string,
    author: {
        avatar: string,
        name: string,
    },
    children?: ReactNode,
}

export function QuestionsBox({ content, author, children }: QuestionsProps) {

    return (
        <div className="question">
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    );
}