import React, { useContext, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import clienteAxios from '../config/axios';
import appContext from '../context/app/appContext';
import authContext from '../context/auth/authContext';
import Formulario from './Formulario';

const Dropzone = () => {
    //context de la App
    const AppContext = useContext(appContext);
    const { cargando, mostrarAlerta, subirArchivo, crearEnlace } = AppContext;
    //context  del usuario
    const AuthContext = useContext(authContext);
    const { usuario, autenticado } = AuthContext;
    const onDropRejected = () => {
        mostrarAlerta('No se pudo subir, el limite es 1MB, obten una cuenta para subir archivos mas grandes !');
    }
    const onDropAccepted = useCallback( async (acceptedFiles) => {
             
        // Crear un form data
        const formData = new FormData();
        formData.append('archivo', acceptedFiles[0]);
        //console.log("Antes...");
        subirArchivo(formData, acceptedFiles[0].path);        
        //console.log("Despues...");
    }, []);
    
    // Extraer contenido de Dropzone
    const { getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({onDropAccepted, onDropRejected, maxSize: 1000000});
    //console.log(acceptedFiles);
    const archivos = acceptedFiles.map( archivo => (
        <li key={archivo.lastModified} className='bg-white flex-1 p-3 mb-4 shadow-lg rouded'>
            <p className='font-bold text-xl'>{archivo.path}</p>
            <p className='text-sm text-gray-500'>{archivo.size} bytes</p>
        </li>
    ));
    //console.log(acceptedFiles.length);
    console.log(cargando);
    // {cargando ? <p className='my-10 text-center text-gray-600'>Subiendo Arhivo</p> : ()}
    
    return ( 
        <div className='md:flex-1 mb-3 mx-2 mt-16 lg:mt-0 flex flex-col items-center justify-center border-dashed border-gray-400 border-2 bg-gray-100 px-4'>
        { acceptedFiles.length > 0 ? (
            <div className='mt-10 w-full'>
                <h4 className='text-2xl font-bold text-center mb-4'>Archivos</h4>
                <ul>
                    {archivos}
                </ul>
                
                { autenticado ? <Formulario /> : ''}

                <button
                    type='button'
                    className='bg-blue-700 w-full py-3 rounded-lg text-white my-10 hover:bg-blue-800'
                    onClick={ () => crearEnlace() }
                >
                    Crear Enlace
                </button>                
            </div>
        ) : (
            <div { ...getRootProps({ className: 'dropzone w-full py-32' })}>
            <input className="h-100 " {...getInputProps() } />
                { 
                isDragActive ? <p className='text-2xl text-center text-gray-600'>Suelta el archivo</p> : 
                 <div className='text-center '>
                    <p className='text-2xl text-center text-gray-600'>Selecciona un archivo y arrastralo aqui</p>
                    <button className='bg-blue-700 w-full py-3 rounded-lg text-white my-10 hover:bg-blue-800' type='button'>
                        Selecciona archivos para subir
                    </button>
                 </div>
                }                
        </div>
        ) }       
      </div> 
     );
}
 
export default Dropzone;
