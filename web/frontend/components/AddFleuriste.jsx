import {
  LegacyCard,
  ResourceList,
  Avatar,
  ResourceItem,
  Text,
  Button,
  TextField,
  Modal,
  FormLayout,
  Divider,
  Checkbox,
  Form
} from '@shopify/polaris';


import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useEffect, useState } from "react";
import { ProductsCard } from "../components/ProductsCard";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";



export default function AddFleuriste() {
  const emptyToastProps = { content: null };
  const fetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(true);
  const [fleuristes, setFleuristes] = useState([]);
  const [editFleuristeList, setEditFleuristeList] = useState(false);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [isAddingFleuriste, setIsAddingFleuriste] = useState(false);

  const {
    data,
    refetch: refetchFleuriste,
    isLoading: isLoadingFleuriste,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/fleuriste",
    reactQueryOptions: {
      onSuccess: (e) => {
        setFleuristes(e);
        setIsLoading(false);
      },
    },
  });


  async function removeFleuriste(id) {
    const response = await fetch(`/api/fleuriste/`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      await refetchFleuriste();
    } else {
      setIsLoading(false);
      setToastProps({
        content: t("ProductsCard.errorCreatingProductsToast"),
        error: true,
      });
    }
  }

  return (
    <>
      <LegacyCard
        title="Fleuristes"
        secondaryFooterActions={[{ content: 'Modifier les fleuriste', onAction: () => setEditFleuristeList(!editFleuristeList) }]}
        primaryFooterAction={{ content: 'Ajouter un fleuriste', onAction: () => setIsAddingFleuriste(!isAddingFleuriste) }}
        sectioned>
        <ResourceList
          resourceName={{ singular: 'customer', plural: 'customers' }}
          items={fleuristes}
          loading={isLoading}
          renderItem={(item) => {
            const { id, name, address1, city, zip, localized_country_name, locationId } = item;
            const media = <Avatar customer size="medium" name={name} />;

            return (
              <ResourceItem
                id={id}
                media={media}
                accessibilityLabel={`View details for ${name}`}
                shortcutActions={[
                  {
                    content: 'Modifier',
                    onAction: () => { },
                  },
                  {
                    content: 'Suprimer',
                    onAction: () => { removeFleuriste(locationId) },
                    destructive: true,
                  }
                ]}
                persistActions
              >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                  {name}
                </Text>
                <div>{address1}, {zip} {city}, {localized_country_name}</div>
                {editFleuristeList && <Button destructive onClick={() => { removeFleuriste(locationId) }}>Suprimer</Button>}
              </ResourceItem>
            );
          }}
        />
      </LegacyCard >
      <AddFleuristePopUp isAddingFleuriste={isAddingFleuriste} setIsAddingFleuriste={setIsAddingFleuriste} refetchFleuriste={refetchFleuriste} />
    </>
  );
}



const AddFleuristePopUp = ({ isAddingFleuriste, setIsAddingFleuriste, refetchFleuriste }) => {
  const fetch = useAuthenticatedFetch();
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [openingHours, setHours] = useState(
    {
      lundi: {
        open: '9',
        close: '18'
      },
      mardi: {
        open: '9',
        close: '18'
      },
      mercredi: {
        open: '9',
        close: '18'
      },
      jeudi: {
        open: '9',
        close: '18'
      },
      vendredi: {
        open: '9',
        close: '18'
      },
      samedi: {
        open: '9',
        close: '18'
      },
      dimanche: {
        open: '9',
        close: '18'
      },
    }
  );



  async function addFleuriste() {
    const response = await fetch(`/api/fleuriste/`, {
      method: "POST",
      body: JSON.stringify({ name, address1, address2, city, zip, country, phone, email, openingHours }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      refetchFleuriste();
      setIsAddingFleuriste(!isAddingFleuriste);
    } else {
      setIsAddingFleuriste(!isAddingFleuriste);
    }
  }

  return (
    <div style={{ height: '500px' }}>
      <Modal
        open={isAddingFleuriste}
        onClose={() => setIsAddingFleuriste(!isAddingFleuriste)}
        title="Ajouter un fleuriste"
        secondaryActions={[
          {
            content: 'Annuler',
            onAction: () => setIsAddingFleuriste(!isAddingFleuriste),
            destructive: true,
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={addFleuriste}>
            <FormLayout>
              <Text variant="heading2xl">Informations</Text>
              <FormLayout.Group>
                <TextField
                  label="Nom du fleuriste"
                  value={name}
                  onChange={e => setName(e)}
                  autoComplete="off"
                  placeholder='La Roserie'

                />
                <TextField
                  label="Adresse"
                  value={address1}
                  onChange={e => setAddress1(e)}
                  autoComplete="off"
                  placeholder='1 rue de la paix'
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  label="Adresse 2"
                  value={address2}
                  onChange={e => setAddress2(e)}
                  autoComplete="off"
                  placeholder='Batiment A'
                />
                <TextField
                  label="Ville"
                  value={city}
                  onChange={e => setCity(e)}
                  autoComplete="off"
                  placeholder='Paris'
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  label="Code postal"
                  value={zip}
                  onChange={e => setZip(e)}
                  autoComplete="off"
                  placeholder='75000'
                />
                <TextField
                  label="Pays"
                  value={country}
                  onChange={e => setCountry(e)}
                  autoComplete="off"
                  placeholder='France'
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  label="Téléphone"
                  value={phone}
                  onChange={e => setPhone(e)}
                  autoComplete="off"
                  placeholder='01 02 03 04 05'
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={e => setEmail(e)}
                  autoComplete="off"
                  placeholder='laroserie@gmail.com'
                />
              </FormLayout.Group>
              <Divider borderColor="border" />
              <Text variant="heading2xl">Horraire d'ouverture</Text>
              {Object.keys(openingHours).map((day, index) => {
                return (
                  <PickHoursComponent hours={openingHours} setHours={setHours} day={day} key={index} />
                )
              })}
              <Button submit primary>Enregistrer</Button>
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </div>
  );
}


const PickHoursComponent = ({ hours, setHours, day }) => {
  const [checked, setChecked] = useState(false);

  function handleClose(isCLosed) {
    if (isCLosed) {
      setChecked(true);
      setHours({ ...hours, [day]: { ...hours[day], open: null, close: null } })
    } else {
      setChecked(false);
      setHours({ ...hours, [day]: { ...hours[day], open: '9', close: '18' } })
    }
  }


  return (
    <>
      <Divider borderColor="border" />
      <FormLayout.Group>
        <Text variant="heading1x1">{day}</Text>
        <Checkbox
          label="Fermer ?"
          checked={checked}
          onChange={() => { handleClose(!checked) }}
        />
      </FormLayout.Group>
      <FormLayout.Group>
        <TextField
          value={hours[day].open}
          onChange={e => setHours({ ...hours, [day]: { ...hours[day], open: e } })}
          autoComplete="off"
          placeholder='ouverture'
          {...checked && { disabled: true }}
        />
        <TextField
          value={hours[day].close}
          onChange={e => setHours({ ...hours, [day]: { ...hours[day], close: e } })}
          autoComplete="off"
          placeholder='fermeture'
          {...checked && { disabled: true }}
        />
      </FormLayout.Group>
    </>
  )
}