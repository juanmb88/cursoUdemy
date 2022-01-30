let pagina = 1

const cita = {
    nombre = " ",
    fecha = " ",
    hora = " ",
    servicios = []
};

document.addEventListener('DOMContentLoaded', function(){
        iniciarApp();
});

    function iniciarApp(){
            mostrarServicios();

            //resaltar el div  actual segun el tab que se presiona
            mostrarSeccion();
            

            //Oculta o muestra una seccion segun el tab que se presiona
            cambiarSeccion();

            //paginacion siguiente y anterior
            paginaSiguiente();
            paginaAnterior();

            //comprueba la pagina actual para ocultar la paginacion (anterior y siguiente)
            botonesPaginador();

            //Muestra el resumen de la cita o mensaje de error en caso de no pasar la validacion
            mostrarResumen();

            //Almacena el nombre de la cita en el objeto
            nombreCita();

            //Almacena la fecha de la cita en el objeto
            fechaCita();

            //Desabilita dias pasados del calendario
            deshabilitarFechaAnterior();
            //Almacena hora de la cita en el objeto
            horaCita();
    }
        function mostrarSeccion(){
            //eliminar mostra-seccion de la seccion anterior
                const seccionAnterior = document.querySelector('.mostrar-seccion');
                if(seccionAnterior){
                seccionAnterior.classList.remove('mostrar-seccion');
            }

            const seccionActual = document.querySelector(`#paso-${pagina}`);
                seccionActual.classList.add('mostrar-seccion')

                //Eliminar la clase actual en el tab anterior
            const tabAnterior = document.querySelector('.tabs .actual');
            if(tabAnterior){
                tabAnterior.classList.remove('actual');
            }
            
            //resalta el tab actual 
            const tab = document.querySelector(`[data-paso="${pagina}"]`);
            tab.classList.add('actual');
        }

        function cambiarSeccion(){
            const enlaces = document.querySelectorAll('.tabs button');

            enlaces.forEach( enlace => {
                    enlace.addEventListener('click', ( e )=>{
                        e.preventDefault();
                    pagina = parseInt(e.target.dataset.paso);

                        mostrarSeccion();
                        botonesPaginador();
                    });
            })
        }

        async function mostrarServicios(){
            try{
                const resultado = await fetch('./servicios.json');
                const db = await resultado.json();

                //con los corchetes decimos que extraiga el contenido de servicios que se encuentra en la variable db
                const { servicios }  =  db;
            
                //Generar HTML
                servicios.forEach( ( servicio )=>{
                    const { id, nombre, precio } = servicio; 

                        //DOM Scripting
                            //Generar Nombre de Servicio
                    const nombreServicio = document.createElement('P');
                        nombreServicio.textContent = nombre;
                        nombreServicio.classList.add('nombre-servicio');

                            //Generar Precio del Servicio
                    const precioServicio = document.createElement('P');
                        precioServicio.textContent = `$ ${ precio}`;
                        precioServicio.classList.add('precio-servicio');

                        //Generar  div contendor de Servicio
                        const servicioDiv = document.createElement("DIV");
                            servicioDiv.classList.add('servicio');
                            servicioDiv.dataset.idServicio = id;

                        //Selecciona un servicio para la cita
                            servicioDiv.onclick = seleccionarServicio;

                        //Inyectar precio y nombre al div de servicio
                            servicioDiv.appendChild(nombreServicio);
                            servicioDiv.appendChild(precioServicio); 

                        //inyectar al codigo HTML
                        document.querySelector('#servicios').appendChild(servicioDiv); 
                })
                
            }catch(e){
                console.log('error'); 
            }
        }

        function seleccionarServicio(e){

            let elemento;
        //forzar que el elemento al que le damos click sea el div
        if(e.target.tagName === 'P'){
                            elemento = e.target.parentElement;
                            
        }else{
                            elemento = e.target;
        }

        if(elemento.classList.contains( 'seleccionado' ) ){
                        elemento.classList.remove( 'seleccionado' );

                        const id = parseInt(elemento.dataset.idServicio)

                        eliminarServicio(id);
        }else{
                        elemento.classList.add('seleccionado');

                        const servicioObj = {
                                            id: parseInt(elemento.dataset.idServicio) ,
                                            nombre: elemento.firstElementChild.textContent ,
                                            precio: elemento.firstElementChild.nextElementSibling.textContent
                        }
        //                console.log(servicioObj);
                        agregarServicio( servicioObj);
        }
        }

        function eliminarServicio(id){
            const { servicios } = cita
            cita.servicios = servicios.filter(servicio => servicio.id !== id);
            console.log(cita);
        }

        function agregarServicio(servicioObj){
                const { servicios } = cita;
                cita.servicios = [...servicios, servicioObj]
                console.log(cita)

        }

        function paginaSiguiente(){
                const paginaSiguiente = document.querySelector('#siguiente');
                    paginaSiguiente.addEventListener('click', ()=>{
                        pagina++;
                        console.log(pagina)

                        botonesPaginador();
                });
        };

        function paginaAnterior(){
            const paginaAnterior = document.querySelector('#anterior');
                paginaAnterior.addEventListener('click', ()=>{
                        pagina--;
                        console.log(pagina)

                        botonesPaginador();
                });
        
        }

        function botonesPaginador(){
            const paginaSiguiente = document.querySelector('#siguiente');
            const paginaAnterior = document.querySelector('#anterior');

            if ( pagina === 1){
                    paginaAnterior.classList.add('ocultar');
            }  else if  (pagina === 3) {
                paginaSiguiente.classList.add('ocultar');
                paginaAnterior.classList.remove ('ocultar');

                mostrarResumen();//Estamos en la pagina tres carga el resumen de la cita
            }else{
                paginaAnterior.classList.remove('ocultar');
                paginaSiguiente.classList.remove('ocultar');
            }
            mostrarSeccion();//cambia  la seccion quer se muestra por la de pagina

        }

        function mostrarResumen(){
            //Destructuring
                const  {nombre, fecha, hora, servicios} = cita;

            //Seleccionar resumen
                const resumenDiv = document.querySelector('.contenido-resumen')

            //Limpia el HTML previo
            while( resumenDiv.firstChild){
                resumenDiv.removeChild(resumenDiv.firstChild);
            }

            //Validacion de objeto
                if(Object.values(cita).includes(" ") ) {
                    const noServicios = document.createElement('P');
                        noServicios.innerHTML = 'Faltan datos de servicios hora, fecha, o nombre ';
                        noServicios.classList.add('invalidar-cita');

                    //Agregar a resumen div
                    resumenDiv.appendChild(noServicios) 
                    return;
                }

                const headingCita = document.createElement('H3');
                    headingCita.textContent = "Resumen de cita";
                
            //Mostrar el Resumen
                const nombreCita = document.createElement('P');
                    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

                const fechaCita = document.createElement('P');
                    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

                const horaCita = document.createElement('P');
                    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

        //creamos esta variable por fuera de los servicios corchetes 248 y 264 (262)
                const serviciosCita = document.createElement('DIV');
                    serviciosCita.classList.add('resumen-servicios');  //para poder seleccionarlo con css

                const headingServicio = document.createElement('H3');
                    headingServicio.textContent = "Resumen de servicios";

                    serviciosCita.appendChild(headingServicio);

                //Iterar sobre el arreglo de servicios

                let cantidad = 0;

                servicios.forEach(servicio =>{
                    const {nombre, precio} = servicio;
                    const contenedorServicio = document.createElement('DIV');
                        contenedorServicio.classList.add('contenedor-servicio');

                    const textoServicio = document.createElement('P');
                        textoServicio.textContent = nombre;

                    const precioServicio = document.createElement('P');
                        precioServicio.textContent = precio;
                        precioServicio.classList.add('precio')

                        const totalServicio = precio.split('$');//para sacar el signo peso
                        // console.log(parseInt(totalServicio[1].trim()));//para q sean separados y aptos para sumar

                        cantidad +=  parseInt(totalServicio[1].trim());
                    //colocar texto y precio en el div
                    contenedorServicio.appendChild(textoServicio);
                    contenedorServicio.appendChild(precioServicio);

                    serviciosCita.appendChild(contenedorServicio);
                    
                });

                console.log(cantidad);
                //Aca mando todo al html
                resumenDiv.appendChild(headingCita);
                resumenDiv.appendChild(nombreCita);
                resumenDiv.appendChild(fechaCita);
                resumenDiv.appendChild(horaCita);
                resumenDiv.appendChild(serviciosCita);

                const cantidadPagar = document.createElement("P");
                cantidadPagar.classList.add('total');
                    cantidadPagar.innerHTML = `<span>Total a pagar :</span> $${cantidad}`;

                    resumenDiv.appendChild(cantidadPagar);
            
        }

        function nombreCita(){
            const nombreInput = document.querySelector('#nombre');
                    nombreInput.addEventListener( 'input', e => {
                        const nombreTexto = e.target.value.trim();
                        //Validacion de que el texto debe tener algo
                        if(nombreTexto === ' ' || nombreTexto.length < 3){
                                mostrarAlerta('Nombre no Valido', 'error')
                        }else{
                            const alerta = document.querySelector('.alerta')
                            if(alerta){
                                alerta.remove();
                            }
                                cita.nombre = nombreTexto;

                                console.log(cita);
                        }
                    })
        }

        function mostrarAlerta(mensaje, tipo){

            //si hay un alerta previa entonces no crear otra
            const alertaPrevia = document.querySelector('.alerta');
            if(alertaPrevia){
                return;
            }

            const alerta = document.createElement('DIV');
            alerta.textContent = mensaje;
            alerta.classList.add('alerta');

            if (tipo === 'error'){
            alerta.classList.add('error'); 
            }
        //Insertar en el HTML
                const formulario = document.querySelector('.formulario');
                formulario.appendChild(alerta);

        //Eliminar la alerta dps de 3 segundos
                setTimeout( () =>{
                        alerta.remove(); 
                }, 3000)
        }

    function fechaCita(){
        const fechaInput = document.querySelector('#fecha');
                fechaInput.addEventListener('input', e =>{
                    
                    const dia = new Date(e.target.value).getUTCDay();
                    
                    if([0, 6].includes(dia)){
                        e.preventDefault();
                        fechaInput.value = ' ';
                        mostrarAlerta('Fines de Semana no son permitidos','error');
                    }else{
                        cita.fecha = fechaInput.value;

                        console.log(cita)
                    }
                })
    }
    function deshabilitarFechaAnterior(){
        const inputFecha = document.querySelector('#fecha');

        const fechaAhora = new Date();
        const year = fechaAhora.getFullYear();
        const mes = fechaAhora.getMonth();
        const dia = fechaAhora.getDate() ;
        const fechaDeshabilitar = `${year}-${mes}-${dia}`;
        

        inputFecha.min = fechaDeshabilitar;
        //Formato deseado  AAAA-MM-DD

    }

    function horaCita(){
        const inputHora = document.querySelector('#hora');
            inputHora.addEventListener('input', e => {
            
            const horaCita = e.target.value;
            const hora = horaCita.split(':');
            
            if(hora[0] < 10 || hora[0] > 18){
                mostrarAlerta('Hora no valida', 'error');
                setTimeout(()=>{
                    inputHora.value = ''; 
                }, 3000);
            }else{
                cita.hora = horaCita;

                console.log(cita)
                }
        });
    }