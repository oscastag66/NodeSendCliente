    import React, {useReducer} from 'react';
    import appContext from './appContext';
    import appReducer from './appReducer';
    import clienteAxios from '../../config/axios';

    import {
        MOSTRAR_ALERTA,
        LIMPIAR_ALERTA,
        SUBIR_ARCHIVO,
        SUBIR_ARCHIVO_EXITO,
        SUBIR_ARCHIVO_ERROR,
        CREAR_ENLACE_EXITO,
        CREAR_ENLACE_ERROR,
        LIMPIAR_STATE,
        AGREGAR_PASSWORD,
        AGREGAR_DESCARGAS
    } from '../../types';

    const AppState = ({children}) => {

        const initialState = {
            mensaje_archivo: null,
            nombre: '',
            nombre_original: '',
            cargando: null,
            descargas: 1,
            password: '',
            autor: null,
            url: ''
        }
        
        const [ state, dispatch ] = useReducer(appReducer, initialState);

        // Muestra una alerta
        const mostrarAlerta = msg => {
            //console.log(msg);
            dispatch({
                type: MOSTRAR_ALERTA,
                payload: msg
            });

            setTimeout(() => {
                dispatch({
                    type: LIMPIAR_ALERTA
                })
            }, 3000);
        };
        const subirArchivo = async (formData, nombreArchivo) => {
            
            dispatch({
                type: SUBIR_ARCHIVO
            })
            
            try {
                // Subir el archivo al servidor 
                const resultado = await clienteAxios.post('/api/archivos', formData);
                //console.log(resultado.data);
                dispatch({
                    type: SUBIR_ARCHIVO_EXITO,
                    payload: { 
                        nombre: resultado.data.archivo,
                        nombre_original:nombreArchivo
                    }
                })
                //console.log('Archivo subido')
            } catch (error) {
                dispatch({
                    type: SUBIR_ARCHIVO_ERROR,
                    payload: error.response.data.msg
                })
            }
        };
        // crea un enlace una vez que se subio el archivo
        const crearEnlace = async () => {
            console.log('Creando enlace...')
            const data = {
                nombre: state.nombre,
                nombre_original: state.nombre_original,
                descargas: state.descargas,
                password: state.password,
                autor: state.autor
            }
            //console.log(data);
            try {
                const resultado = await clienteAxios.post('/api/enlaces', data);
                //console.log(resultado);
                dispatch({
                    type: CREAR_ENLACE_EXITO,
                    payload: resultado.data.msg                    
                });
                
            } catch (error) {
                console.log(error)
            }
            console.log("fin enlace...")
        }
        const limpiarState = () => {
           dispatch({
               type: LIMPIAR_STATE
           })
        }
        // Agregar el password
        const agregarPassword = (password) => {
            dispatch({
                type: AGREGAR_PASSWORD,
                payload: password
            })           
        }
        // Agregar numero de Descargas
        const agregarDescargas = (descargas) => {
            dispatch({
                type: AGREGAR_DESCARGAS,
                payload: descargas
            })           
        }
        return (
            <appContext.Provider
                value={{
                    mensaje_archivo: state.mensaje_archivo,
                    nombre: state.nombre,
                    nombre_original: state.nombre_original,
                    cargando: state.cargando,
                    descargas: state.descargas,
                    password: state.password,
                    autor: state.autor,
                    url: state.url,
                    mostrarAlerta,
                    subirArchivo,
                    crearEnlace,
                    limpiarState,
                    agregarPassword,
                    agregarDescargas 
                }}
            >
                {children}
            </appContext.Provider>
        )
    }

    export default AppState;
