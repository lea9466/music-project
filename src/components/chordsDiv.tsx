import type { ChordDto, FullSongDto } from "../types";
type Props = {
    fullSong: FullSongDto,
    useFlats?: boolean,
    ton?: number,
    isFromScaning: boolean,
    chordsFromAI?: Record<number, ChordDto[]>
}

function ChordsDiv(props: Props) {
    console.log(props.chordsFromAI);

    const sharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    const { fullSong, useFlats, ton, isFromScaning, chordsFromAI = [] } = props
    console.log(fullSong.chordsByLine);

    const words = (fullSong.wordLines || []).map(line => ({
        index: line.lineNumber,
        value: line.text
    })); const chords = Object.entries(fullSong.chordsByLine || {}).map(([key, value]) => ({
        index: Number(key),
        value: value
    }));
    if (!fullSong.wordLines || fullSong.wordLines.length === 0) {
        return <div>טוען נתונים...</div>;
    }

    const mergedArray = mergeByIndex(words, chords);
    console.log(mergedArray);

    let songAndChord = [];
    for (let i = 0; i < mergedArray.length; i++) {
        if (typeof mergedArray[i].value === 'string') {
            let str = mergedArray[i].value
            if (str != '') {
                if (str[0] == '#') {
                    songAndChord.push(<br />)
                    songAndChord.push(<h3>{str.slice(1)}</h3>)
                }
                else {
                    songAndChord.push(<div>{str}</div>)
                }
            }
        }
        else {
            if (isFromScaning) {
                songAndChord.push(<ChordsLineScan chords={chordsFromAI[i + 1] || []} isFromAI={true} />)
                songAndChord.push(<ChordsLineScan chords={mergedArray[i].value} />)

            }
            else {
                // songAndChord.push(<br/>)
                songAndChord.push(<ChordsLine 
                    chords={mergedArray[i].value}
                    sharps={sharps}
                    flats={flats}
                    ton={ton}
                    isFlat={useFlats}
                />)
            }

        }
    }


    return (
        <>
            <div className="chords" style={{ alignItems: `${fullSong.song.language == 'E' ? 'flex-start' : 'flex-end'}`, display: 'flex', flexDirection: 'column' }}>
                {songAndChord}
            </div>
        </>
    )
}
export default ChordsDiv


function ChordsLine(props: any) {
    let str = []
    const sharps = props.sharps
    const flats = props.flats
    const isFlat = props.isFlat
    const chords = props.chords
    const kind = (isFlat == true ? flats : sharps)
    const ton = props.ton
    for (let i = chords.length - 1; i >= 0; i--) {
        if (chords[i].adding != '' && chords[i].adding != null) {
            str.push(<div className='char' style={{ display: 'flex', flexDirection: 'row' }}>
                <div>{kind[((sharps.indexOf(chords[i].name) + ton) % 12 + 12) % 12]}</div>
                {chords[i].adding[0] == 'm' && <div>{chords[i].adding[0]}</div>}
                <h5 >{chords[i].adding.slice(1)}</h5>
            </div>)
        }
        else str.push(<div className='char'>{kind[((sharps.indexOf(chords[i].name) + ton) % 12 + 12) % 12]}</div>)
        for (let k = 0; k < chords[i].spaces; k++)
            str.push(<div>{' '}</div>);
    }
    return (
        <div style={{ whiteSpace: 'pre', display: 'flex', flexDirection: 'row', justifyContent: 'center' ,marginTop:'5px'}}>
            {str}
        </div>
    )
}

type ChordsLineScanType = {
    chords: ChordDto[];
    isFromAI?: boolean;
}
function ChordsLineScan(props: ChordsLineScanType) {
    let str = []
    const chords = props.chords
    for (let i = chords.length - 1; i >= 0; i--) {
        if (chords[i].adding != '' && chords[i].adding != null) {
            str.push(<div className={`char${props.isFromAI || ''}`} style={{ display: 'flex', flexDirection: 'row' }}>
                <div>{chords[i].name}</div>
                {chords[i].adding![0] == 'm' && <div>{chords[i].adding![0]}</div>}
                <h5>{chords[i].adding!.slice(1)}</h5>
                {chords[i].reason && (
                    <span className="custom-tooltip">{chords[i].reason}</span>
                )}
            </div>)
        }
        else str.push(<div
            className={`char${props.isFromAI || ''}`}>{chords[i].name}
            {chords[i].reason && (
                <span className="custom-tooltip">{chords[i].reason}</span>
            )}
        </div>)
        for (let k = 0; k < chords[i].spaces!; k++)
            str.push(<div>{' '}</div>);
    }
    return (
        <div style={{ whiteSpace: 'pre', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {str}
        </div>
    )
}


function mergeByIndex(words: any, chords: any) {
    let merged = [];
    let i = 0, j = 0;

    while (i < words.length || j < chords.length) {
        if (i < words.length && (j >= chords.length || words[i].index < chords[j].index)) {
            // אם האינדקס של word קטן מהאינדקס של chord
            merged.push(words[i]);
            i++;
        } else if (j < chords.length && (i >= words.length || chords[j].index < words[i].index)) {
            // אם האינדקס של chord קטן מהאינדקס של word
            merged.push(chords[j]);
            j++;
        } else {
            // אם האינדקסים שווים, נבחר רק אחד מהם
            i++;
            j++;
        }
    }

    return merged;
}