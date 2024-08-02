import React, { useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50vw;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex-direction: column
`;

const ChildrenContent = styled.div`
    padding: 20px;
    min-width: 80vw;
`

const CarouselContainer = styled.div`
  height: 30vh;
  background-color: #F0F0F0;
`

const CarouselImg = styled.img`
  height: 30vh;
  width: auto;
  object-fit:contain;
`

const Modal = ({ isOpen, onClose, selectedPlace, children }) => {
  if (!isOpen) return null;
  console.log(selectedPlace)
  return (
    <ModalWrapper>
      <ModalContent>
        <ChildrenContent>
          <CarouselContainer id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <CarouselImg src={`${import.meta.env.VITE_API_URL}/api/files/${selectedPlace.collectionId}/${selectedPlace.id}/${selectedPlace.main_picture}`} className="d-block w-100" alt="..."/>
              </div>
              {
                selectedPlace.other_pictures.map((image, index) => (
                <div className="carousel-item ">
                  <CarouselImg src={`${import.meta.env.VITE_API_URL}/api/files/${selectedPlace.collectionId}/${selectedPlace.id}/${image}`} className="d-block w-100" alt="..."/>
                </div>
                ))
              }
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </CarouselContainer>
        {parse(children)}
        </ChildrenContent>

        <button onClick={onClose}>Close</button>
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;