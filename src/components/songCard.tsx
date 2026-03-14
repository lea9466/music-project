import '../style/songCard.css'
import { useSelector } from 'react-redux';
import '../style/songList.css'
import type { CategoryDto, SongDto } from '../types';
import type { RootState } from '../redux/store';
function SongCard(props: { song: SongDto, onClick: Function }) {
    const categories: CategoryDto[] = useSelector((state: RootState) => state.categories.categories)
    const { song, onClick } = props;
    return (
        <>
            <div className="songCard" key={song.id}>


                <div className="divider"></div>

                <div className="artistDiv">
                    <div>מבצע בפועל:</div>
                    <div className="bold">{song.artist}</div>
                </div>
                <div className="songNameDiv">
                    <div>שם השיר:</div>
                    <div className="bold">{song.name}</div>
                </div>
                <div className="divider"></div>

                <div className="categoryName">
                    <div>קטגוריה:</div>
                    <div className="bold">{categories.find(cat => song.categoryId == cat.id)?.name}</div>
                </div>
                <div className="divider"></div>

                <div className="puclishDate">
                    <div>תאריך הפצה:</div>
                    <div className="bold">{song.date}</div>
                </div>
                <div className="divider"></div>

                <button style={{ display: 'flex', flexDirection: 'row' }} onClick={() => onClick(onClick)}>
                    <img src="src/img/music_note_24dp_CC30D1A7_FILL0_wght400_GRAD0_opsz24.svg" alt="" />
                    לאקורדים
                </button>









            </div>


        </>
    )

}
export default SongCard