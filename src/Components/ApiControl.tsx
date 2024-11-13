import { Button } from '@fluentui/react-components';
import { useState } from 'react';

type ApiControlProps = {
    apiName: string;
    onClick: () => Promise<string>;
    input?: string;
};

function ApiControl({ apiName, onClick, input }: ApiControlProps) {
    const [result, setResult] = useState<string | null>(null);

    const handleClick = async () => {
        try {
            const response = await onClick();
            setResult(response);
        } catch (e) {
            setResult(JSON.stringify(e));
        }
    };

    return (
        <div className='api-control'>
            <h3>{apiName}</h3>
            <div>
                {input && <input type='text' value={input} />}
                <Button onClick={handleClick}>Call API</Button>
            </div>
            <textarea className='result' value={result || ''} readOnly />
        </div>
    );
}

export default ApiControl;
