-- Function to safely increment tickets sold
create or replace function increment_tickets_sold(
  p_ticket_type_id uuid,
  p_quantity int
)
returns void
language plpgsql
security definer
as $$
declare
  v_available int;
begin
  -- Get available tickets
  select (quantity - quantity_sold) into v_available
  from ticket_types
  where id = p_ticket_type_id
  for update;

  if v_available >= p_quantity then
    -- Update quantity sold
    update ticket_types
    set quantity_sold = quantity_sold + p_quantity
    where id = p_ticket_type_id;
  else
    raise exception 'Not enough tickets available';
  end if;
end;
$$;