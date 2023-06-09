import Link from "next/link";
import { useRouter } from "next/router.js";
import useSWR from "swr";
import styled from "styled-components";
import { StyledLink } from "../../../components/StyledLink.js";
import { StyledButton } from "../../../components/StyledButton.js";
import { StyledImage } from "../../../components/StyledImage.js";
import { useState } from "react";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal.js";
import { set } from "mongoose";

const ImageContainer = styled.div`
  position: relative;
  height: 15rem;
`;

const ButtonContainer = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 0.2rem;

  & > * {
    flex-grow: 1;
    text-align: center;
  }
`;

const StyledLocationLink = styled(StyledLink)`
  text-align: center;
  background-color: rgb(221, 235, 253);
  border: 3px solid rgb(255, 160, 122);
  width: 50%;
  justify-self: center;
`;

export default function DetailsPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;

  const [modalIsVisible, setModalIsVisible] = useState(false);

  function handleModalIsVisible() {
    setModalIsVisible(!modalIsVisible);
  }

  console.log("router:", router);
  console.log("router.query:", router.query);

  const { data: place, isLoading, error } = useSWR(`/api/places/${id}`);

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  async function deletePlace() {
    if (alert("Sorry, can't let you actually do that :(")) {
      // DEACTIVATED for now
      // await fetch(`/api/places/${id}`, {
      //   method: "DELETE",
      // });
    }
    setModalIsVisible(false);
  }

  return (
    <>
      <Link href={"/"} passHref legacyBehavior>
        <StyledLink justifySelf="start">back</StyledLink>
      </Link>
      <ImageContainer>
        <StyledImage
          src={place.image}
          priority
          fill
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          alt=""
        />
      </ImageContainer>
      <h2>
        {place.name}, {place.location}
      </h2>
      <Link href={place.mapURL} passHref legacyBehavior>
        <StyledLocationLink>Location on Google Maps</StyledLocationLink>
      </Link>
      <p>{place.description}</p>
      <ButtonContainer>
        <Link href={`/places/${id}/edit`} passHref legacyBehavior>
          <StyledLink>Edit</StyledLink>
        </Link>
        <StyledButton
          type="button"
          onClick={handleModalIsVisible}
          variant="delete"
        >
          Delete
        </StyledButton>
        {modalIsVisible && (
          <ConfirmDeleteModal
            handleModalIsVisible={handleModalIsVisible}
            deletePlace={deletePlace}
            placeName={place.name}
          />
        )}
      </ButtonContainer>
    </>
  );
}

export { ButtonContainer };
