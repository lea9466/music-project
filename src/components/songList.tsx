import { useSelector } from 'react-redux';
import '../style/songList.css'
import type { CategoryDto, SongDto } from '../types';
import type { RootState } from '../redux/store';

//תצוגת שיר חיצונית ברשימה
function SongList(props: { song: SongDto, onClick: Function }) {

    const categories: CategoryDto[] = useSelector((state: RootState) => state.categories.categories)
    const { song, onClick } = props;
    return (
        <>
            <div className="songList" key={song.id}>
                <div className="songNameDiv">
                    <div>שם השיר:</div>
                    <div className="bold">{song.name}</div>
                </div>


                <div className="artistDiv">
                    <div>מבצע בפועל:</div>
                    <div className="bold">{song.artist}</div>
                </div>

                <div className="divider"></div>

                {/* <div className="categoryName">
                    <div>קטגוריה:</div>
                    <div className="bold">{categories.find(cat => song.categoryId == cat.id)?.name}</div>
                </div> */}



                <div className="publishDate">
                    <div>תאריך הפצה:</div>
                    <div className="bold">{song.date}</div>
                </div>

                <div className="song-info-container">
                    <strong className="info-item like-item">
                        <span className="material-symbols-outlined">
                            thumb_up
                        </span>
                        {song.chordLikesCount}
                    </strong>
                    <strong className="info-item view-item">
                        <span className="material-symbols-outlined info-icon">
                            visibility
                        </span>
                        {song.viewsCount}
                    </strong>
                </div>

                <button className='tochordsbtn' style={{ display: 'flex', flexDirection: 'row' }} onClick={() => onClick(onClick)}>
                    <span className="material-symbols-outlined">music_note</span>
                    <div className="chordBtn">לאקורדים</div>
                </button>











            </div>


        </>
    )

}
export default SongList