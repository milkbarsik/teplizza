-- Создание таблицы sections
CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    plants_count INT NOT NULL DEFAULT 0,
    temperature FLOAT NOT NULL,
    wetness INT NOT NULL,
    light INT NOT NULL
);

-- Создание таблицы plants с уникальным ограничением на section_id и number_in_section
CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    section_id INT NOT NULL,
    number_in_section INT NOT NULL,
    name_of_plant VARCHAR(255) NOT NULL,
    planting_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		water_level INT NOT NULL DEFAULT 24,
		default_water_level INT NOT NULL DEFAULT 24,
		feed_level INT NOT NULL DEFAULT 48,
		default_feed_level INT NOT NULL DEFAULT 48,
    FOREIGN KEY (section_id) REFERENCES sections(id),
    UNIQUE (section_id, number_in_section)
);

-- Создание таблицы environment_log
CREATE TABLE environment_log (
    id SERIAL PRIMARY KEY,
    temperature FLOAT NOT NULL,
    wetness FLOAT NOT NULL,
    light FLOAT NOT NULL,
    section_id INT NOT NULL,
    time_log TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- Создание таблицы staff
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    person_name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    patronymic VARCHAR(255)
);

-- Создание таблицы watering_log
CREATE TABLE watering_log (
    id SERIAL PRIMARY KEY,
    plant_id INT NOT NULL,
    staff_id INT NOT NULL,
    time_log TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- Создание таблицы feed_log
CREATE TABLE feed_log (
    id SERIAL PRIMARY KEY,
    plant_id INT NOT NULL,
    staff_id INT NOT NULL,
    time_log TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- Создание таблицы schedule_log
CREATE TABLE schedule_log (
    id SERIAL PRIMARY KEY,
    staff_id INT NOT NULL,
    time_from TIMESTAMP NOT NULL,
    time_to TIMESTAMP NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- Создание таблицы delivery_log
CREATE TABLE delivery_log (
    id SERIAL PRIMARY KEY,
    from_delivery VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    count_product INT NOT NULL,
    time_log TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Создание функции триггера для увеличения plants_count
CREATE OR REPLACE FUNCTION increment_plants_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Обновляем значение plants_count в таблице sections
    UPDATE sections
    SET plants_count = plants_count + 1
    WHERE id = NEW.section_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создание триггера для вставки
CREATE TRIGGER after_plant_insert
AFTER INSERT ON plants
FOR EACH ROW
EXECUTE FUNCTION increment_plants_count();

-- Создание функции триггера для уменьшения plants_count
CREATE OR REPLACE FUNCTION decrement_plants_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Обновляем значение plants_count в таблице sections
    UPDATE sections
    SET plants_count = plants_count - 1
    WHERE id = OLD.section_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Создание триггера для удаления
CREATE TRIGGER after_plant_delete
AFTER DELETE ON plants
FOR EACH ROW
EXECUTE FUNCTION decrement_plants_count();
