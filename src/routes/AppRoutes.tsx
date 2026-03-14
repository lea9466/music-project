import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import Layout from '../components/Layouts';
import PersonalArea from '../pages/PersonalArea';
import SongController from '../pages/SongController';
import ChordsOfSong from '../components/chord';
import Categories from '../components/categories';
// import SongsPage from '../pages/SongsPage';
// import SongDetailsPage from '../pages/SongDetailsPage';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />, // האבא שכולל הדר ופותר
        children: [
            {
                path: "/", // דף הבית
                element: <Home />,
            },
            {
                path: "/sign-in", // דף התחברות
                element: <SignIn />,
            },
            {
                path: "/PersonalArea", // דף התחברות
                element: <PersonalArea />,

            },
            {
                path: "SongController",
                element: <SongController />
            },
            {
                path: "chords/:id",
                element: <ChordsOfSong />
            },
            {
                path: "/categories", 
                element: <Categories />,
            },
        ],
    },
]);